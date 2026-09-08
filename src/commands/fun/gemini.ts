import config from "config.json.js";
import type { Message } from "@deksdeveloper/discord.js-self-bot";
import type { Cmd, CmdData, Ctx } from "~/util/base";

const data: CmdData = {
  name: "gemini",
};

async function execute(
    ctx: Ctx,
    message: Message,
    channelId: string,
    args: string[],
) {
  await message.reply(config.fun.gemini);
}

export default {
  data,
  execute,
} as Cmd;