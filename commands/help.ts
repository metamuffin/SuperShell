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
        if (!a.args[0]){
            Shell.error("Too few arguments. Take a look at the help file for this command.")
            return 1
        }
        var out:String = `SUPERSHELL HELP FILE FOR ${a.args[0]}\n`;
        if (a.args[0] == "*"){
            for (const c of Shell.commands) {
                out += `    ${c.name} - ${c.info}\n`
            }
        } else {
            var com:Command = Shell.commands.find((c) => c.name == a.args[0])
            if (!com) {
                Shell.error("help: Cant find what you were looking for.")
                return 1
            }
            out += `${com.name} - ${com.info}\n`
            for (const flag of com.flags) {
                out += `   -${flag.short}\t--${flag.long}\t${flag.value ? "V" : " "} ${flag.info}\n`
            }
        }
        
        Shell.log(out);
        return 0
    }
}