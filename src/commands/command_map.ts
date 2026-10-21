import type { State } from "../state.js";


export async function commandMap(state: State){
    const locations = await state.pokeAPI.fetchLocations(state.nextLocationsURL);
    state.nextLocationsURL = locations.next ?? undefined;

    for (const location of locations.results){
        console.log(location.name);
    }

}
