import { Command } from "./command";

export interface CommandFlagRule {
    short: string|undefined,
    long: string,
    value: boolean,
    info: string
}

export type CommandArgsRules = Array<CommandFlagRule>

export interface CommandFlag {
    name:string,
    value:string,
    shortcutUsed:boolean
}

export interface CommandArgs {
    flags: Array<CommandFlag>,
    args:Array<string>
}

export function parseArgs(input:string, com:Command):CommandArgs|string {
    var input_spl = splitQuotes(input)
    
    var rules = com.flags
    var a:CommandArgs = {
        args: [],
        flags: []
    }
    var activeFlag:CommandFlag|null = null;

    for (const o of input_spl) {

        if (activeFlag != null){
            activeFlag.value = o
            a.flags.push(activeFlag)
            activeFlag = null
            continue
        }

        if (o.startsWith("--")){
            var flag_long = o.slice(2)
            var flag = rules.find((f) => f.long == flag_long.toLowerCase())
            if (!flag){
                return `flag unknown: ${flag_long}`
            }
            if (flag.value) {
                activeFlag = {
                    name: flag.long,
                    shortcutUsed: false,
                    value: null
                }
            } else {
                a.flags.push({
                    name: flag.long,
                    shortcutUsed: false,
                    value: null
                })
            }
            continue
        }
        if (o.startsWith("-")){
            var flag_short = o.slice(1)
            var flag = rules.find((f) => f.short == flag_short.toLowerCase())
            if (!flag){
                return `flag unknown: ${flag_short}`
            }
            if (flag.value) {
                activeFlag = {
                    name: flag.long,
                    shortcutUsed: true,
                    value: null
                }
            } else {
                a.flags.push({
                    name: flag.long,
                    shortcutUsed: true,
                    value: null
                })
            }
            continue
        }

        a.args.push(o)
    }
    return a;
}

export function splitQuotes(input:string):Array<string> {

    var quotes:string = "\"'"
    var cquotes:string|null = null
    var cbuffer = ""
    var spl:Array<string> = []

    for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i);

        if (char == " " && (cquotes == null)){
            spl.push(cbuffer)
            cbuffer = ""
            continue
        }

        if (cquotes == char){
            quotes = null;
            continue
        }
        if (quotes.search(char) != -1) {
            cquotes = char;
            continue
        }

        cbuffer += char
        
        
    }
    if (cbuffer.length != 0) spl.push(cbuffer)

    return spl
}