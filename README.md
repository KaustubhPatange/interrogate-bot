# Interrogate-Bot [<img src="https://github.com/KaustubhPatange/interrogate-bot/workflows/build/badge.svg" alt="Build-CI" align="right" />](https://github.com/KaustubhPatange/interrogate-bot/actions)

[<img src="art/logo.svg" height="150px" alt="Wiki-Bot" align="right" />](https://discord.com/api/oauth2/authorize?client_id=787565956989452309&permissions=522304&scope=bot)

**Interrogate-Bot** is a bot for [Discord](https://discord.com/) that will find answers to your question. Questions can be definitions or a classic `What/How to` one, for both of them the bot will smartly make assumptions about what you want and reply you with the answer.

_Note: The searches or answers may not match the original question in some cases, because it's a bot not an AI_ :)

> The bot is hosted on a free-tier plan on [Heroku](https://heroku.com/) (since this is my non-profit hobby project), so if you find it being offline or not responding to your command it may be that the quota is over. If you find this bot helpful & want to help me hosting it, create a [Github issue](https://github.com/KaustubhPatange/interrogate-bot/issues).

- [Add **Interrogate-Bot** to your server.](https://discord.com/api/oauth2/authorize?client_id=787565956989452309&permissions=522304&scope=bot)
- [Bot offline? Check discord status.](https://discordstatus.com/)

## Commands

After [inviting](https://discord.com/api/oauth2/authorize?client_id=787565956989452309&permissions=522304&scope=bot) **Interrogate-Bot** to your server, you can use the following commands.

| Command                       | Description                                                           |
| ----------------------------- | --------------------------------------------------------------------- |
| `!ibot find <query>`          | Reply you with the closely matched answer it finds.                   |
| `!ibot find-s <query>`        | Reply you with a curated list of short answers.                       |
| `!ibot clear <option number>` | Clear the messages send by this bot & messages that invoked this bot. |
| `!ibot help`                  | Shows the list of available commands.                                 |

## How it works?

The answer finder algorithm is a web-scrapper over [answers.yahoo.com](https://answers.yahoo.com) & short answers from [answers.com](https://answers.com), so every question you ask to the bot will be fetched from that website.

**What makes it so special then?** So if you notice there may be a question which the website doesn't have any answer for or might be closely matched! But, it may be lost in the endless results (due to SEO ranking). Using string matching pattern, the bot calculates a precision point (i.e how two questions are closely related based on their wordings). If the point exceeds certain number it fetches full response for that question otherwise replies you with the similar matches of the question with the hyperlinks for follow-up.

## Credits

- All images & icons are taken from [Icons8](https://icons8.com/).

## License

- [The Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt)

```
Copyright 2020 Kaustubh Patange

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
