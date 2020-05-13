import { Shell } from "..";
import { cTest } from './test';
import { cHelp, cPlsHelp } from './help';
import { cCWD, cGo } from './filesystem';




export function loadCommands(){
    Shell.commands = [
        cTest,
        cHelp,
        cPlsHelp,
        cCWD,
        cGo
    ]
}