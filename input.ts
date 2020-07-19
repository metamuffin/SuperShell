import { openSync, readSync } from "fs";
import { Shell } from ".";


/*
    Position the Cursor: \033[<L>;<C>H or \033[<L>;<C>f (puts the cursor at line L and column C)
    Move the cursor up N lines: \033[<N>A
    Move the cursor down N lines: \033[<N>B
    Move the cursor forward N columns: \033[<N>C
    Move the cursor backward N columns: \033[<N>D
    Clear the screen, move to (0,0): \033[2J
    Erase to end of line: \033[K
    Save cursor position: \033[s
    Restore cursor position: \033[u
*/


export class Prompt {


    public static prompt(){

        var log_str:string = ""
        var log_cursor:number = 0
        
        var fd:number = openSync('/dev/tty', 'rs');
        var buffer:Buffer = Buffer.alloc(3)
        Shell.write("SUPERSHELL>")
        process.stdin.setRawMode(true)
        while(1){
            var read = readSync(fd,buffer,0,3,null);
            if (read > 0){
                var char = buffer[read-1];

                var out = String.fromCharCode(char)

                var bufstr = buffer.toString()
                if (read > 1){
                    if (bufstr == "\u001b[A"){ // UP
                        out = "\u001b[1A"
                        log_cursor += 1
                    }
                    if (bufstr == "\u001b[B"){ // DOWN
                        out = "\u001b[1B"
                    }
                    if (bufstr == "\u001b[D"){ // LEFT
                        out = "\u001b[1D"
                        log_cursor -= (log_cursor) ? 1 : 0
                    }
                    if (bufstr == "\u001b[C"){ // RIGHT
                        out = "\u001b[1C"
                    }
                }

                
                if (char == 9) out = "Autocomplete is not avalible."
                if (char == 3) process.exit(130); // ^C
                
                if (char == 13) {
                    return log_str
                }

                if (char == 127 || char == 8) {
                    out = '\u001b[1D'
                    log_cursor -= 1;
                }
                
                if (out == String.fromCharCode(buffer[read-1])){ // default case
                    var before = log_str.slice(0,log_cursor)
                    var after = log_str.slice(log_cursor)
                    log_str = before + String.fromCharCode(char) + ((after.length > 0) ? after.slice(1) : after)
                    log_cursor += 1;
                }
                
                //process.stdout.write(out)
                Shell.write(out)
                
            }

        }
        process.stdin.setRawMode(false)

    }









}