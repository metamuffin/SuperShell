import { Command } from '../command';
import { Shell } from '../index';


export class Filesystem {
    public static currentPath:Array<string>


    public static go(p:string):number {
        

        return 0
    }


    public static getCWD():string {
        return this.currentPath.join("/")
    }
}


export var cGo:Command = {
    name: "go",
    flags: [],
    info: "GO into a directory.",
    handle: (a) => {
        
        return 0
    }
}

export var cCWD:Command = {
    name: "cwd",
    info: "Get the current working directory.",
    flags: [
        {
            short: "w",
            long: "windows",
            info: "Use windows path format",
            value: false
        }
    ],
    handle: (a) => {
        var o = Filesystem.getCWD()
        if (a.flags.find(f => f.name == "windows") != null) o = o.replace("/","\\")
        Shell.log(o)
        return 0 
    }
}