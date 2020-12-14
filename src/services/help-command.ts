import { Message } from "discord.js";
import { injectable } from "inversify";
import { BotCommands, GITHUB_URI } from "../constants";

@injectable()
export class HelpCommand {
    public isMatched(command: string) {
        return command.trim() == "help"
    }

    public command(message: Message): Promise<Message> {
        let answer = "Hello I'm a bot, a smart one not an AI :). I can help you find answers to your question!\n\n"
        answer += "Here is a list of all commands I'm known of\n"
        BotCommands.forEach(c => {
            answer += `:small_blue_diamond: \`${c.command}\` - ${c.functionality}\n`
        })
        answer += `\nIf you find any issues with the response feel free to contact over [Github](${GITHUB_URI}).`
        return message.reply(answer)
    }
}