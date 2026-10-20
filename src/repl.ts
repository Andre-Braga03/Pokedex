import{createInterface} from "node:readline";
import {commandExit} from "./command_exit.js";
import {commandHelp} from "./command_help.js";
import type { CLICommand } from "./command.js";

export function cleanInput(input:string): string[]{
    return input.toLocaleLowerCase().trim().split(/\s+/);
}

export function getCommands(): Record<string, CLICommand>{
    return{
        exit: {
            name: "exit",
            description: "Exit the Pokedex",
            callback: commandExit,
        },
        help: {
            name: "help",
            description: "Show the help menu",
            callback: (commands: Record<string, CLICommand>) => commandHelp(commands),
        },
    }
}
export function startREPL(){
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "Pokedex> ",
    });

    rl.prompt();

    rl.on("line", (input) => {
        const words = cleanInput(input);
        if(words.length === 0){
            rl.prompt();
            return;
        }

        const commands = getCommands();
        const commandName = words[0];
        const command = commands[commandName];
        if(!command){
            console.log(`Unknown command`);
            rl.prompt();
            return;
        }
        try{
            command.callback(commands);
        } catch(error){
            console.error(`${error}`);
        }
        rl.prompt();
  
    });
}