import config from "config.json";
import type { Message } from "@deksdeveloper/discord.js-self-bot";
import type { Cmd, CmdData, Ctx } from "~/util/base";

const data: CmdData = {
  name: "claude",
};

async function execute(
    ctx: Ctx,
    message: Message,
    channelId: string,
    args: string[],
) {
  await message.reply(config.fun.claude);
}

export default {
  data,
  execute,
} as Cmd;