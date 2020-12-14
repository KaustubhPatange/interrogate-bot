import Discord, { Message } from "discord.js";
import { injectable } from "inversify";
import { isString } from "../utils/extensions";
import { FindHelper, QuestionResult } from "../utils/find-helper";
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
        const msg = await message.channel.send("Searching 1/2")
        const findResult = await FindHelper.find(data);
        if (findResult != null) {
            await message.react('👍')
            if (isString(findResult)) { // A perfect match has been found.
                await msg.edit("Searching 2/2")
                const result = await FindHelper.captureJson(findResult as string)
                await msg.delete()

                // Discord has limit of sending message length fewer than 2000.
                let answer = result.answer.replace(/&#39;/g, "'")
                if (answer.length > 1300) {
                    answer = `${result.answer.substring(0, 1300)}..., [read more](${result})`
                }
                return message.reply(`A perfect search has been found,\n\n**Q. ${result.question}**\n${answer}\n\n_- ${result.author}_`)
            } else {
                await msg.delete()
                const array = findResult as QuestionResult[]
                let answer = "Some similar searches has been found,\n\n"

                // This will also handle Discord message character send limit.
                for (let i = 0; i < array.length; i++) {
                    if (answer.length > 1300) break;
                    const r = array[i]
                    answer += `**Q. ${r.question}**\n${r.shortAnswer} [read more](${r.uri})\n\n`
                }
                answer += "_Note: This searches might not be perfect, I'm just a bot not an AI :)_"
                return message.reply(answer)
            }
        }
        await message.react('👎')
        return msg.edit(`Question: **${data}** was not found`)
    }
}