require('dotenv').config(); // Recommended way of loading dotenv
import container from "./inversify.config";
import { TYPES } from "./types";
import { Bot } from "./bot";

const isDebug = (process.argv[2] === 'debug')

let bot = container.get<Bot>(TYPES.Bot);
bot.listen().then(() => {
    console.log('Logged in!')
    if (isDebug) {
        // We just check if it can run the node app
        console.log("Debug instance ran successfully... Exiting")
        process.exit(0)
    }
}).catch((error) => {
    console.log('Oh no! ', error)
    if (isDebug) {
        process.exit(1) // Failed to ran...
    }
});