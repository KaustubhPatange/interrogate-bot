import Discord, { Emoji, Message, MessageReaction } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { PREFIX } from "../constants";
import { ClearChat } from "./clear-chat";
import { FindQuery } from "./find-query";
import { HelpCommand } from "./help-command";

@injectable()
export class MessageResponder {
    private clearChat: ClearChat
    private findQuery: FindQuery
    private helpCommand: HelpCommand

    constructor(
        @inject(TYPES.ClearChat) clearChat: ClearChat,
        @inject(TYPES.FindQuery) findQuery: FindQuery,
        @inject(TYPES.HelpCommand) helpCommand: HelpCommand,
    ) {
        this.clearChat = clearChat;
        this.findQuery = findQuery;
        this.helpCommand = helpCommand
    }

    handle(message: Message): Promise<any> {
        if (message.author.id === message.client.user.id) return Promise.reject();
        if (!message.content.startsWith(PREFIX)) return Promise.reject();

        const query = message.content.substring(PREFIX.length).trim()

        if (this.helpCommand.isMatched(query)) {
            return this.helpCommand.command(message)
        }

        const clearMatched = this.clearChat.isMatched(query)
        if (clearMatched != null) {
            return this.clearChat.command(message, clearMatched)
        }

        const findMatched = this.findQuery.isMatched(query)
        if (findMatched != null) {
            this.findQuery.command(message, findMatched)
        }
        return Promise.reject();
    }
}