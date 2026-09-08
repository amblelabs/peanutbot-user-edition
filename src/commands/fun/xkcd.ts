import type { Message } from "@deksdeveloper/discord.js-self-bot";
import type { Cmd, CmdData, Ctx } from "~/util/base";

const data: CmdData = {
    name: "xkcd",
};

async function execute(
    ctx: Ctx,
    message: Message,
    channelId: string,
    args: string[],
) {
    const comicNum = args[0];

    if (!comicNum || !/^\d+$/.test(comicNum)) {
        await message.reply("Please provide a valid comic number");
        return;
    }

    try {
        const response = await fetch(`https://xkcd.com/${comicNum}/info.0.json`);

        if (!response.ok) {
            await message.reply(`Comic ${comicNum} not found.`);
            return;
        }

        const comicData = (await response.json()) as {
            num: number;
            title: string;
            img: string;
            alt: string;
        };

        await message.reply({
            content: `${comicData.title}\n${comicData.alt}\nhttps://xkcd.com/${comicData.num}/`,
            files: [{ attachment: comicData.img, name: `xkcd-${comicData.num}.png` }],
            flags: ["SUPPRESS_EMBEDS"],
        });
    } catch (error) {
        console.error("Error fetching xkcd comic:", error);
        await message.reply("Failed to fetch the requested XKCD comic.");
    }
}

export default {
    data,
    execute,
} as Cmd;