import { Command } from "../command";
import { Shell } from '../index';




export var cTest:Command = {
    name: "test",
    flags: [
        {
            short: "a",
            long: "apfel",
            info: "Apfel",
            value: false
        },
        {
            short: "b",
            long: "blub",
            info: "Blub",
            value: true
        }
    ],
    info: "Test it!",
    handle: (a) => {
        Shell.log(a);
        return 0
    }
}