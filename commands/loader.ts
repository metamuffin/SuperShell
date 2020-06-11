import { Shell } from "..";
import { cTest } from './test';
import { cHelp, cPlsHelp } from './help';
import { cCWD, cGo, cList } from './filesystem';




export function loadCommands(){
    Shell.commands = [
        cTest,
        cHelp,
        cPlsHelp,
        cCWD,
        cGo,
        cList
    ]
}