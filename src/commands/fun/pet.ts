import config from "config.json";
import type { Message } from "@deksdeveloper/discord.js-self-bot";
import type { Cmd, CmdData, Ctx } from "~/util/base";
import cache from "~/util/cache";

const url =
    "http://raw.githubusercontent.com/amblelabs/peanutbot/master/assets/peanut_pet_1.webm";

const data: CmdData = {
    name: "pet",
};

async function play(channel: any) {
    if (channel && typeof channel.send === "function") {
        cache.uncache(url, (m) => channel.send(m));
    }
}

async function execute(
    ctx: Ctx,
    message: Message,
    channelId: string,
    args: string[],
) {
    if (config.fun.pet.enabled) {
        await play(message.channel);
    }
}

export default {
    data,
    execute,
} as Cmd;