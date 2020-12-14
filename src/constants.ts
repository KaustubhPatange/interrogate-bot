export const PREFIX = "!ibot";
export const GITHUB_URI = "https://github.com/KaustubhPatange/interrogate-bot"

export interface Command {
    command: string,
    functionality: string
}

export const BotCommands: Command[] = [
    {
        command: "!ibot find <query>",
        functionality: "Reply you with the closely matched answer it finds."
    },
    {
        command: "!ibot clear <option number>",
        functionality: "Clear the messages send by this bot & messages that invoked this bot."
    },
    {
        command: "!ibot help",
        functionality: "Shows the list of available commands."
    }
]