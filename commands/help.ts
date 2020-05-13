import { Command } from '../command';
import { Shell } from '../index';




export var cHelp:Command = {
    name: "help",
    flags: [],
    info: "Get hacker help.",
    handle: (a) => {
        Shell.log("plshelp: Real hackers dont need this")
        return 0
    }
}

export var cPlsHelp:Command = {
    name: "plshelp",
    flags: [],
    info: "Get help.",
    handle: (a) => {
        Shell.log("Not yet implemented. Sorry ¯\\_(ツ)_/¯")
        return 0
    }
}