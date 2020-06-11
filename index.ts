import { readSync, openSync } from "fs"
import { Command } from './command';
import { Prompt } from './input';
import { parseArgs } from './parser';
import { loadCommands } from './commands/loader';
import { sleep } from "./utils";

const prompt = require("prompt-sync")()

export class Shell {
    public static commands:Array<Command> = [];

    public static init(){
        loadCommands()
        console.log("SuperShell  [Version 10.0.18363.778]")
        console.log("(c) 2020 MetaMuffif Corporation. Alle Blubs vorbehalten.");

    }


    public static async mainPrompt():Promise<number> {
        var i:string = Prompt.prompt()
        i = i.trim()
        console.log();
        if (i == "") return 0
        
        var isplit = i.split(" ")
        var cname = isplit.shift()
        var cargs_raw = isplit.join(" ")
        var c = this.commands.find((c) => c.name == cname)
        if (!c) {
            this.error("superlel: command not found, not avalible, not working, too busy, no want or anything else went wrong.")
            return 1
        }
        var cargs = parseArgs(cargs_raw,c)
        if (typeof cargs == "string"){
            this.error(cargs);
            return 1
        }
        
        return await c.handle(cargs)
    }

    public static async mainPromptLoop(){
        while (1) {
            var ret = await this.mainPrompt()
            if (ret == 0) continue
            if (ret > 0) {
                await sleep(3000)
                Shell.clear()
                Shell.log("\n :(\n")
                Shell.log(" It looks like your SuperShell implementation run into a problem.");
                Shell.log(" We (actually nobody) will just collect some personal data and then we will restart your Shell. ")
                await sleep(10000)
                Shell.clear()
            }
        }
    }

    public static clear(){
        console.clear();
    }

    public static log(s:any){
        console.log(s)
    }

    public static error(s:any){
        console.warn(s)
    }
}

Shell.init()
Shell.mainPromptLoop()