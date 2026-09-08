import config from "config.json";
import type { Message } from "@deksdeveloper/discord.js-self-bot";
import type { Cmd, CmdData, Ctx } from "~/util/base";
import wrath from "~/util/angry";

const data: CmdData = {
  name: "sleep",
};

async function execute(
    ctx: Ctx,
    message: Message,
    channelId: string,
    args: string[],
) {
  if (config.fun.sleep.enabled) {
    const hasRole = message.member?.roles.cache.has(config.fun.sleep.role);

    if (!hasRole) {
      await wrath.sendAngry(message);
      return;
    }

    ctx.fallAsleep();

    await message.reply("_Zzz...._");
  }
}

export default {
  data,
  execute,
} as Cmd;