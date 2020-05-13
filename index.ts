import { readSync, openSync } from "fs"
import { Command } from './command';
import { Prompt } from './input';
import { parseArgs } from './parser';
import { loadCommands } from './commands/loader';

const prompt = require("prompt-sync")()

export class Shell {
    public static commands:Array<Command> = [];

    public static init(){
        loadCommands()
        console.log("SuperShell  [Version 10.0.18363.778]")
        console.log("(c) 2020 MetaMuffif Corporation. Alle Blubs vorbehalten.");

    }


    public static mainPrompt(){
        var i:string = Prompt.prompt()
        i = i.trim()
        console.log();
        if (i == "") return
        
        var isplit = i.split(" ")
        var cname = isplit.shift()
        var cargs_raw = isplit.join(" ")
        var c = this.commands.find((c) => c.name == cname)
        if (!c) {
            this.error("superlel: command not found, not avalible, not working, too busy, no want or anything else went wrong.")
            return
        }
        var cargs = parseArgs(cargs_raw,c)
        if (typeof cargs == "string"){
            this.error(cargs);
            return
        }
        
        c.handle(cargs)
    }

    public static log(s:any){
        console.log(s)
    }

    public static error(s:any){
        console.warn(s)
    }
}

Shell.init()
while(1) Shell.mainPrompt()