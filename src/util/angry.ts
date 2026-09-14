import config from "config.json";
import { type Message } from "@deksdeveloper/discord.js-self-bot";
import cache from "./cache";

const url =
  "http://raw.githubusercontent.com/amblelabs/peanutbot/master/assets/angry.png";

async function sendAngry(message: Message) {
    await cache.uncache(url, (m) => message.reply(m));
}
export default {
  sendAngry,
};
