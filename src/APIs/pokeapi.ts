import { Cache } from "../pokecache.js";
import type { Pokemon } from "../state.js";
export class PokeAPI {
    private static readonly baseURL = "https://pokeapi.co/api/v2";
    #cache = new Cache(60_000);
  
    constructor() {}
  
    async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
      const url = pageURL || `${PokeAPI.baseURL}/location-area`;

      const cached = this.#cache.get<ShallowLocations>(url);

      if(cached){
        console.log("cache hit");
        return cached;
      }


      const response = await fetch(url);

      if(!response.ok){
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }

      const locations : ShallowLocations = await response.json();
      this.#cache.add(url, locations);
      return locations;
    }
  
    async fetchLocation(locationName: string): Promise<Location> {
      const url = `${PokeAPI.baseURL}/location-area/${locationName}`;
     
      const cached = this.#cache.get<Location>(url);
      if(cached){
        console.log("cache hit");
        return cached;
      }

      const response = await fetch(url);
    
      if(!response.ok){
        throw new Error(`Failed to fetch location: ${response.statusText}`);
      }
      const location : Location = await response.json();
      this.#cache.add(url, location);
      return location;
    }
    async fetchPokemon(pokemonName: string): Promise<Pokemon> {
      const url = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;
      const cached = this.#cache.get<Pokemon>(url);
  
      if(cached){
        console.log("cache hit");
        return cached;
      }
      const response = await fetch(url);
      if(!response.ok){
        throw new Error(`Failed to fetch pokemon: ${response.statusText}`);
      }
  
      const pokemon : Pokemon = await response.json();
      this.#cache.add(url, pokemon);
      return pokemon;
    }
    
  } 

  
  export type ShallowLocations = {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
      name: string;
      url: string;
    }[];
  };
  
  export type Location = {
    pokemon_encounters: {
      pokemon: {
        name: string;
        url: string;
      };
    }[];
  };