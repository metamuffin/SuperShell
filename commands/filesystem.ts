import { Command } from '../command';
import { Shell } from '../index';
import { readdirSync, stat, statSync } from 'fs';

export type FPath = Array<string>

export class Filesystem {
    public static currentPath:FPath = (process.platform == "win32") ? process.cwd().split("\\") : process.cwd().split("/")

    public static pathFromString(p:string){
        if (!p) return undefined;
        return (process.platform == "win32") ? p.split("\\") : p.split("/")
    }

    public static stringFromPath(p:FPath){
        if (!p) return undefined;
        return (process.platform == "win32") ? p.join("\\") : p.join("/")
    }

    public static go(p:string):number {
        if (p == ".."){
            if (this.currentPath.pop()){
                return 0
            } else {
                Shell.log("go: You cant go higher than that.")
                return 1
            }
        }
        var dir = this.list(this.currentPath)
        if (dir.includes(p)){
            var npath = this.currentPath.slice(0)
            npath.push(p)
            if (statSync(this.stringFromPath(npath)).isDirectory()){
                this.currentPath = npath
            } else {
                Shell.log("go: This is a File!!! Not a directory.")
                return 1
            }
        } else {
            Shell.log("go: Directory not found")
            return 1
        }
        return 0
    }

    public static list(p:FPath){
        var path = this.stringFromPath(p)
        var dir = readdirSync(path);
        return dir
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
        if (!a.args[0]){
            Shell.log("Bruh. Tell me where to go please!")
            return 1
        }
        Filesystem.go(a.args[0])
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

export var cList:Command = {
    name: "list",
    info: "Get list of directory contents",
    flags: [
        {
            info: "Show files that start with a dot",
            long: "showhidden",
            short: "a",
            value: false
        }
    ],
    handle: (a) => {
        var path = Filesystem.pathFromString(a.args[0]) || Filesystem.currentPath
        var dir = Filesystem.list(path)
        var out = `Contents of ${Filesystem.stringFromPath(path)}\n`
        for (const f of dir) {
            if (f.startsWith(".") && (a.flags.findIndex((f) => f.name = "showhidden") == -1)) continue
            var fpath = Filesystem.stringFromPath([...path, f])
            var sout = statSync(fpath)
            out += "<" + (sout.isDirectory() ? "DIR  " : "") + (sout.isFile() ? "FILE " : "") + (sout.isSymbolicLink() ? "SYML " : "") + (sout.isSocket() ? "SOCK " : "") + "> "
            out += f
            out += "\n"
            
        }
        Shell.log(out)
        return 0
    }
}