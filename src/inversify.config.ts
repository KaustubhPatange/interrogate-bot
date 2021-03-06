import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { Bot } from "./bot";
import { Client } from "discord.js";
import { MessageResponder } from "./services/message-responder";
import { ClearChat } from "./services/clear-chat";
import { FindQuery } from "./services/find-query";
import { HelpCommand } from "./services/help-command";
import { FindShortQuery } from "./services/find-short-query";


let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();
container.bind<ClearChat>(TYPES.ClearChat).to(ClearChat).inSingletonScope();
container.bind<FindQuery>(TYPES.FindQuery).to(FindQuery).inSingletonScope();
container.bind<FindShortQuery>(TYPES.FindShortQuery).to(FindShortQuery).inSingletonScope();
container.bind<HelpCommand>(TYPES.HelpCommand).to(HelpCommand).inSingletonScope();

export default container;