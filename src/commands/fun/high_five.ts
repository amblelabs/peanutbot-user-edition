import config from "config.json";
import type { Message } from "@deksdeveloper/discord.js-self-bot";
import type { Cmd, CmdData, Ctx } from "~/util/base";
import rnd from "~/util/rnd";

const data: CmdData = {
    name: "high_five",
};

async function onMessage(ctx: Ctx, message: Message) {
    const isMentioned =
        ctx.client.user && message.mentions.users.has(ctx.client.user.id);

    if (
        message.content.toLowerCase().includes("high five") &&
        isMentioned
    ) {
        await message.reply(rnd.pickRandom(config.fun.highfives));
    }
}

export default {
    data,
    onMessage,
} as Cmd;