import type { State, Pokemon } from "../state.js";

export async function commandCatch(state: State, ...args: string[]){
    if(args.length !== 1){
        console.log("you must provide a pokemon name");
        return;
    }

    const name = args[0];
    const pokemon = await state.pokeAPI.fetchPokemon(name);
    console.log(`Throwing a Pokeball at ${name}...`);

    const chance = Math.floor(Math.random() * pokemon.base_experience);
    if(chance > 40){
        console.log(`${name} escaped!`);
        return;
    }
    state.pokedex[pokemon.name] = pokemon;
    console.log(`${name} was caught!`);
  
}
