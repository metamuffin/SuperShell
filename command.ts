import { CommandArgsRules, CommandArgs } from './parser';



export interface Command {
    name: string,
    info: string,
    flags: CommandArgsRules,
    handle: (args:CommandArgs) => number
}
