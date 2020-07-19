import { readSync, openSync } from "fs"
import { Command } from './command';
import { Prompt } from './input';
import { parseArgs } from './parser';
import { loadCommands } from './commands/loader';
import { sleep } from "./utils";

const prompt = require("prompt-sync")()

export interface CursorPos {
    x: number,
    y: number
}

export class Shell {
    public static commands:Array<Command> = [];

    public static cursorPos: CursorPos = {x:0,y:0}
    public static promptOrigin: CursorPos = {x:0,y:0}

    public static init(){
        console.clear();
        loadCommands()
        console.log("SuperShell  [Version 10.0.18363.778]")
        console.log("(-_-) 2020 MetaMuffif Corporation. Alle Blubs vorbehalten.");

    }


    public static async mainPrompt():Promise<number> {
        var i:string = Prompt.prompt()
        i = i.trim()
        Shell.log("")
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
                await sleep(30)
                Shell.clear()
                Shell.log("\n :(\n")
                Shell.log(" It looks like your SuperShell implementation run into a problem.");
                Shell.log(" We (actually nobody) will just collect some personal data and then we will restart your Shell. ")
                await sleep(100)
                Shell.clear()
            }
        }
    }

    public static clear(){
        console.clear();
        this.cursorPos = {x:0,y:0};
        this.promptOrigin = {x:0,y:0};
    }

    public static userMove(o: CursorPos) {
        this.cursorPos.x += o.x
        this.cursorPos.y += o.y
        this.promptOrigin.x += o.x
        this.promptOrigin.y = o.y

        if (this.promptOrigin.x < 0) {
            this.promptOrigin.x = 0
            this.cursorPos.x = 0
        } else {
            if (o.x != 0) process.stdout.write(`\u001b[${Math.abs(o.x)}${(o.x < 0) ? 'D' : 'C'}`);
            if (o.y != 0) process.stdout.write(`\u001b[${Math.abs(o.y)}${(o.y < 0) ? 'B' : 'A'}`);
        }
        
    }

    public static log(s:any) {
        this.write(s.toString() + "\n");
    }

    public static write(s:string){
        for (var i = 0; i < s.length; i++) {
            var leftStr = s.substr(i)
            
            if (leftStr.startsWith("\n")) {
                process.stdout.write(`\n`);
                if (this.promptOrigin.x != 0) process.stdout.write(`\u001b[${this.promptOrigin.x}C`);
                this.promptOrigin.y += 1;
                this.cursorPos.x = this.promptOrigin.x
                this.cursorPos.y = this.promptOrigin.y
            } else {
                if (leftStr.startsWith("\u001b[1")) {
                    i += 3;
                    if (leftStr.startsWith("\u001b[1A")){ Shell.userMove({x: 0, y: 1}) }
                    if (leftStr.startsWith("\u001b[1B")){ Shell.userMove({x: 0, y: -1}) }
                    if (leftStr.startsWith("\u001b[1D")){ Shell.userMove({x: -1, y: 0}) }
                    if (leftStr.startsWith("\u001b[1C")){ Shell.userMove({x: 1, y: 0}) }    
                } else {
                    this.cursorPos.x++;
                    process.stdout.write(s.charAt(i));
                }
            }
        }
    }

    public static error(s:string){
        Shell.log(s)
    }
}

Shell.init()
Shell.mainPromptLoop()
