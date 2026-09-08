import type { Client, Message } from "@deksdeveloper/discord.js-self-bot";
import type { Sequelize } from "sequelize";
import type { SearchClient } from "./wikisearch2";

export type CmdData = {
  name: string;
  description?: string;
};

export type Cmd = {
  data: CmdData;
  setup?: (ctx: Ctx) => Promise<void> | void;
  execute?: (
      ctx: Ctx,
      message: Message,
      channelId: string,
      args: string[],
  ) => Promise<void> | void;
  // This can be used for passive listening (e.g. tracking keywords)
  onMessage?: (ctx: Ctx, message: Message) => Promise<void> | void;
};

export type Ctx = {
  client: Client;
  sleeping: boolean;
  sql: Sequelize;
  lastUse: number;

  wakeUp: (message?: Message) => void;
  fallAsleep: () => void;

  search: SearchClient;
};

export function format(str: string, ...values: any[]) {
  if (values) {
    var t = typeof values[0];
    var key;
    var args: any[] =
        "string" === t || "number" === t ? values.slice() : values[0];

    for (key in args) {
      str = str.replace(new RegExp(`\\{${key}\\}`, "gi"), args[key]);
    }
  }

  return str;
}