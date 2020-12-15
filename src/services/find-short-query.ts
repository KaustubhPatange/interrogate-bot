import { Message } from "discord.js";
import { injectable } from "inversify";
import { FindShortHelper } from "../utils/find-short-helper";
import { StringUtils } from "../utils/string-utils";

@injectable()
export class FindShortQuery {
    private regexp = /find-s\s(.*)/
    private endsWithReply = "Note: This searches might not be perfect, I'm just a bot not an AI :)"

    public isMatched(command: string): string | null {
        const result = command.match(this.regexp)
        if (result == null) return
        if (StringUtils.isNullOrEmpty(result[1])) return null;
        return result[1] != null ? result[1] : null
    }

    public async command(message: Message, query: string): Promise<Message | any> {
        let replyMessage = ""
        const result = await FindShortHelper.find(query)
        if (result === null) {
            await message.react('👎')
            replyMessage = `Question: **${query}** not found,`
        } else {
            await message.react('👍')
            replyMessage = "A curated list of short answers are found\n\n"
            result.forEach(c => {
                let answer = c.shortAnswer.length > 360 ? `${c.shortAnswer.substring(0, c.shortAnswer.length)}... [read more](${c.uri})` : c.shortAnswer
                replyMessage += `**Q. ${c.question}**\n${answer}\n`
            })
            replyMessage += `_${this.endsWithReply}_`
        }
        return message.reply(replyMessage)

    }
}