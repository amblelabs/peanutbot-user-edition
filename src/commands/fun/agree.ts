import config from "config.json";
import type { Message } from "@deksdeveloper/discord.js-self-bot";
import type { Cmd, CmdData, Ctx } from "~/util/base";
import rnd from "~/util/rnd";

const data: CmdData = {
  name: "agree_with_me",
};

async function onMessage(ctx: Ctx, message: Message) {
  const isMentioned =
      ctx.client.user && message.mentions.users.has(ctx.client.user.id);

  if (!isMentioned) return;

  const content = message.content.toLowerCase();

  if (content.includes("?") && content.includes("agree")) {
    await message.reply(rnd.pickRandom(config.fun.agree));
  }
}

export default {
  data,
  onMessage,
} as Cmd;