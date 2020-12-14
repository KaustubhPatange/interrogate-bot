import { DMChannel, Message, TextChannel } from "discord.js";
import { injectable } from "inversify";
import { PREFIX } from "../constants";

@injectable()
export class ClearChat {

    private regexp = /clear\s?([\d]+)?/

    public isMatched(text: string): number | null {
        const matches = text.match(this.regexp)
        if (matches == null) return null
        const limiter = (matches[1] != undefined) ? Number((Number(matches[1]) < 100) ? matches[1] : 99) : Number(99)
        return limiter;
    }

    public async command(message: Message, limiter: Number): Promise<Message | any> {
        const listOfMessages = await message.channel.messages.fetch({ limit: 99 })
        const allMessages = listOfMessages.filter(c => c.author.id === message.client.user.id || c.content.startsWith(PREFIX))
        if (message.channel instanceof DMChannel) {
            return await message.reply("Not supported for DM channels")
        } else {
            message.delete();
            return await message.channel.bulkDelete(allMessages);
        }
    }
}