import { readSync, openSync } from "fs"

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


function mainPrompt(){
    
    var fd = (process.platform === 'win32') ?
      0 :
      openSync('/dev/tty', 'rs');

    var buffer = Buffer.alloc(3)
    process.stdin.setRawMode(true)

    while(1){
        var read = readSync(fd,buffer,0,3,null);
        if (read > 0){
            var char = buffer[read-1];
            var out = String.fromCharCode(char)

            if (char == 9) out = "Autocomplete is not avalible."
            if (char == 3) process.exit(130); // ^C


            if (char == 127 || char == 8) {
                out = '\u001b[1D'
            }


            

            process.stdout.write(out)
        }

    }

    process.stdin.setRawMode(false)
}


mainPrompt()

