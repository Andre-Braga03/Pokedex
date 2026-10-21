
import type { State } from "./state.js";

export function cleanInput(input:string): string[]{
    return input.toLocaleLowerCase().trim().split(/\s+/);
}

export function startREPL(state: State){
    const rl = state.readline;
    rl.prompt();

    rl.on("line", async (input) => {
        const words = cleanInput(input);
        if(words.length === 0){
            rl.prompt();
            return;
        }

        const commands = state.commands;
        const commandName = words[0];
        const command = commands[commandName];
        if(!command){
            console.log(`Unknown command`);
            rl.prompt();
            return;
        }

        try{
            await command.callback(state, ...words.slice(1));
            
        } catch (error) {
            console.error(`${error}`);
        }
        rl.prompt();
    });
}