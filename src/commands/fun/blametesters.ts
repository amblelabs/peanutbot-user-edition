import config from "config.json";
import type { Message } from "@deksdeveloper/discord.js-self-bot";
import type { Cmd, CmdData, Ctx } from "~/util/base";
import rnd from "~/util/rnd";

const data: CmdData = {
    name: "blame",
};

async function onMessage(ctx: Ctx, message: Message) {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const isMentioned =
        ctx.client.user && message.mentions.users.has(ctx.client.user.id);

    const responsible =
        isMentioned &&
        content.includes("who") &&
        (content.includes("responsible") || content.includes("blame"));

    if (responsible) {
        await message.reply(
            rnd.pickRandom(
                config.fun.blame.antifun.concat(config.fun.blame.noUpdates),
            ),
        );
        return;
    }

    const misc =
        ((content.includes("gamebreaking") ||
                content.includes("game-breaking") ||
                content.includes("game breaking")) &&
            content.includes("bug")) ||
        ((content.includes("release") ||
                content.includes("mod") ||
                content.includes("upate")) &&
            (content.includes("lag") || content.includes("bug")));

    if (misc) {
        await message.reply(rnd.pickRandom(config.fun.blame.antifun));
        return;
    }

    const noUpdates =
        content.includes("no updates") ||
        content.includes("release was") ||
        content.includes("update was");

    if (noUpdates) {
        await message.reply(rnd.pickRandom(config.fun.blame.noUpdates));
    }
}

export default {
    data,
    onMessage,
} as Cmd;