import { Client, CustomStatus } from "@deksdeveloper/discord.js-self-bot";
import config from "../config.json.js";
import env from "../env.json.js";
import type { Cmd, Ctx } from "./util/base.ts";
import fs from "node:fs";
import path from "node:path";
import { logger } from "./util/logger.ts";
import { Sequelize } from "sequelize";
import { oramaStaticClient } from "./util/wikisearch2.ts";
import { create as createOrama } from "@orama/orama";

const dbPath = path.resolve(__dirname, "../database.sqlite");

// Initialize user bot client natively
const client = new Client();

const ctx: Ctx = {
  client,
  sql: new Sequelize({
    dialect: "sqlite",
    logging: (sql) => logger.debug(sql),
    storage: dbPath,
  }),
  sleeping: false,
  lastUse: Date.now(),

  wakeUp: (message?: any) => {
    ctx.sleeping = false;

    // Set standard Discord presence correctly
    ctx.client.user?.setStatus("online");
    const status = new CustomStatus(ctx.client).setState("Watching ?help");
    ctx.client.user?.setActivity(status);

    // If triggered by a message, reply in the same channel
    if (message && message.channel) {
      message.channel.send({
        stickers: [config.fun.sleep.awakeSticker],
      }).catch((err: any) => logger.error("Failed to send awake sticker:", err));
    }
  },

  fallAsleep: () => {
    ctx.sleeping = true;

    ctx.client.user?.setStatus("idle");
    const status = new CustomStatus(ctx.client).setState("Watching dreams...");
    ctx.client.user?.setActivity(status);
  },

  search: oramaStaticClient({
    initOrama: () => {
      return createOrama({
        schema: { _: "string" },
        language: "english",
      });
    },
    locale: "en",
    from: config.wikisearch.baseUrl + config.wikisearch.index,
  }),
};

const handlers: Record<string, Cmd> = {};

// Command loader
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath).default;

    if (command?.data?.name) {
      handlers[command.data.name] = command;
    } else {
      logger.warn(
          `The command at ${filePath} is missing a required "data" property.`,
      );
    }
  }
}

// Client Ready Event
ctx.client.once("ready", async () => {
  for (const cmd of Object.values(handlers)) {
    if (cmd?.setup) cmd.setup(ctx);
  }

  await ctx.sql.authenticate();
  ctx.wakeUp();

  logger.info(`Ready! User bot logged in as ${ctx.client.user?.tag}`);
});

// Message Listener (Updated from "message" to "messageCreate")
ctx.client.on("messageCreate", async (message: any) => {
  const content = message.content || "";

  if (!content.startsWith("?")) {
    if (
        ctx.sleeping &&
        content.length > 1 &&
        content === content.toUpperCase() &&
        content.includes("!")
    ) {
      ctx.wakeUp(message);
    }

    for (const handler of Object.values(handlers)) {
      if (handler?.onMessage) handler.onMessage(ctx, message);
    }
    return;
  }

  ctx.lastUse = Date.now();

  const command = content.substring(1);
  const args = command.split(" ");
  const first = args[0];

  const handler = handlers[first];

  async function handleCommand(handler?: Cmd) {
    if (handler?.execute) {
      // Use message.channel.id or message.channelId
      handler.execute(ctx, message, message.channel.id, args.slice(1));
    }
  }

  if (ctx.sleeping) {
    ctx.wakeUp();
    message.channel.send({ content: "..." }).catch(() => {});

    setTimeout(
        async () => handleCommand(handler),
        config.fun.sleep.cmdDelay * 1000,
    );
  } else {
    handleCommand(handler);
  }
});

// Timers
function tickMinute() {
  const now = Date.now();
  if (!ctx.sleeping && (now - ctx.lastUse > config.fun.sleep.timer * 60 * 1000)) {
    ctx.fallAsleep();
  }
}

async function tickSleepSticker() {
  if (ctx.sleeping && config.fun.sleep.channel) {
    try {
      // Fetch channel directly if it is not in cache (common for DMs/GDMs)
      const channel: any =
          ctx.client.channels.cache.get(config.fun.sleep.channel) ||
          (await ctx.client.channels.fetch(config.fun.sleep.channel));

      if (channel && typeof channel.send === "function") {
        await channel.send({
          stickers: [config.fun.sleep.sticker],
        });
      }
    } catch (err) {
      logger.error("Failed to send sleep sticker:", err);
    }
  }
}

process.on("uncaughtException", (err) => {
  logger.fatal("Uncaught Exception:");
  logger.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.fatal("Unhandled Rejection:");
  logger.error(err);
  process.exit(1);
});

setInterval(tickMinute, 60 * 1000); // every minute
setInterval(tickSleepSticker, 60 * 61 * 1000); // every hour

// Log in using user token
ctx.client.login(env.token);