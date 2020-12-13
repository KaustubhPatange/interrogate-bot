import { Message } from "discord.js";
import { injectable } from "inversify";
import { FindHelper } from "../utils/find-helper";
import { StringUtils } from "../utils/string-utils";

@injectable()
export class FindQuery {
    private regexp = /find\s?(.*)/

    public isMatched(command: string): string | null {
        const result = command.match(this.regexp)
        if (result == null) return
        if (StringUtils.isNullOrEmpty(result[1])) return null;
        return result[1] != null ? result[1] : null
    }

    public async command(message: Message, data: string): Promise<any> {
        await message.react('👍')
        const msg = await message.channel.send("Searching 1/2")
        const URL = await FindHelper.find(data);
        await msg.edit("Searching 2/2")
        const result = await FindHelper.captureJson(URL)
        await msg.delete()

        // Discord has limit of sending message length fewer than 2000
        let answer = result.answer.replace(/&#39;/g, "'")
        if (answer.length > 1300) {
            answer = `${result.answer.substring(0, 1300)}\n\n${URL}`
        }
        return message.reply(`\n**Q. ${result.question}**\n${answer}\n\n_- ${result.author}_`)
    }
}