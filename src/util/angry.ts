import config from "config.json";
import { type Message } from "@deksdeveloper/discord.js-self-bot";
import cache from "./cache";

const url =
  "http://raw.githubusercontent.com/amblelabs/peanutbot/master/assets/angry.png";

async function sendAngry(message: Message) {
    await cache.uncache(url, (options) =>
        message.reply({
            content: config.fun.wrath.message,
            files: options.files ?? (options.content ? [options.content] : []),
        })
    );
}
export default {
  sendAngry,
};
