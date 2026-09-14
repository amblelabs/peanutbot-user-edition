import config from "config.json";
import { type Message } from "@deksdeveloper/discord.js-self-bot";
import cache from "./cache";

const url =
  "http://raw.githubusercontent.com/amblelabs/peanutbot/master/assets/angry.png";

async function sendAngry(message: Message) {
  cache.uncache(url, (m) => {
    return message.reply({
      ...m,
      content: config.fun.wrath.message
    });
  });
}
export default {
  sendAngry,
};
