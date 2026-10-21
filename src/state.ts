import { PokeAPI } from "./APIs/pokeapi.js";
import { createInterface, type Interface } from "node:readline";

import { commandExit } from "./commands/command_exit.js";
import { commandHelp } from "./commands/command_help.js";
import { commandMap } from "./commands/command_map.js";
import { commandExplore } from "./commands/command_explore.js";
import { commandCatch } from "./commands/command_catch.js";
import { commandInspect } from "./commands/command_inspect.js";
import { commandPokedex } from "./commands/command_pokedex.js";


export type State = {
    commands: Record<string, CLICommand>;
    readline: Interface;
    pokeAPI: PokeAPI;
    nextLocationsURL?: string;
    pokedex: Record<string, Pokemon>;
}

export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State, ...args: string[]) => Promise<void>;
}

export type Pokemon = {
    name: string;
    base_experience: number;
    height: number;
    weight: number;
    stats: {
       base_stat: number;
       stat: {
        name: string;
       };
    }[];
    types: {
        type: {
            name: string;
        };
       
    }[];
};

export function initState(): State {

    const pokeAPI = new PokeAPI();
    
    const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Pokedex> ',
    });

    return {
        readline,
        pokeAPI,
        nextLocationsURL: undefined,
        pokedex: {},
        commands: {
            exit: {
                name: "exit",
                description: "Exit the Pokedex",
                callback: commandExit,
            },
            help: {
                name: "help",
                description: "Show the help menu",
                callback: commandHelp,
            },
            map: {
                name: "map",
                description: "Displays the next 20 location areas",
                callback: commandMap,
            },
            explore: {
                name: "explore",
                description: `explore <location name>`,
                callback: commandExplore,
            },
            catch: {
                name: "catch",
                description: `catch <pokemon name>`,
                callback: commandCatch,
            },
            inspect: {
                name: "inspect",
                description: `inspect <pokemon name>`,
                callback: commandInspect,
            },
            pokedex: {
                name: "pokedex",
                description: "Show your Pokedex",
                callback: commandPokedex,
            },
      
    },
  };
}