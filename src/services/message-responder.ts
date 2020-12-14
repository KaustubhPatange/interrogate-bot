import Discord, { Emoji, Message, MessageReaction } from "discord.js";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { PREFIX } from "..";
import { ClearChat } from "./clear-chat";
import { FindQuery } from "./find-query";

@injectable()
export class MessageResponder {
    private clearChat: ClearChat
    private findQuery: FindQuery

    constructor(
        @inject(TYPES.ClearChat) clearChat: ClearChat,
        @inject(TYPES.FindQuery) findQuery: FindQuery
    ) {
        this.clearChat = clearChat;
        this.findQuery = findQuery;
    }

    handle(message: Message): Promise<any> {
        if (!message.content.startsWith(PREFIX)) return Promise.reject();
        const query = message.content.substring(PREFIX.length).trim()

        const clearMatched = this.clearChat.isMatched(query)
        if (clearMatched != null) {
            return this.clearChat.command(message, clearMatched);
        }

        const findMatched = this.findQuery.isMatched(query);
        if (findMatched != null) {
            this.findQuery.command(message, findMatched)
            console.log("Match:" + findMatched);
        }
        return Promise.reject();
    }
}