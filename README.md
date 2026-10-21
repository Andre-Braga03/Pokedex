# Pokedex

A command-line Pokedex. You explore location areas, catch Pokémon, and inspect the ones you have caught. Data comes from the [PokeAPI](https://pokeapi.co/).

The program is a REPL: it reads a line, runs the matching command, prints the result, and waits for the next line.

## Commands

| Command | What it does |
| --- | --- |
| `help` | Lists every registered command and its description. |
| `map` | Prints the next 20 location areas. Each call advances to the following page. |
| `explore <area>` | Lists the Pokémon that can be found in that location area. |
| `catch <pokemon>` | Tries to catch a Pokémon. A higher `base_experience` makes the catch less likely. |
| `inspect <pokemon>` | Prints name, height, weight, stats, and types for a Pokémon you have already caught. |
| `pokedex` | Lists the names of every Pokémon in your Pokédex. |
| `exit` | Closes the prompt and leaves the program. |

An unknown command prints `Unknown command`.

## Run

Requires Node.js 22.

```bash
npm install
npm run dev
```

`npm run dev` compiles TypeScript with `tsc` and starts `dist/main.js`. `npm test` runs the Vitest suite.

## How it is put together

`main.ts` builds one `State` object and hands it to the REPL. That object lives for the whole session. It holds the readline interface, the API client, the URL of the next location page, the command registry, and the caught Pokémon.

Each command is a function stored in a `Record<string, CLICommand>`. The REPL cleans the input, uses the first word as the command name, and passes the remaining words as arguments:

```ts
await command.callback(state, ...words.slice(1));
```

`cleanInput` lowercases the line, trims it, and splits on whitespace, so `Catch  Pikachu` becomes `["catch", "pikachu"]`.

Caught Pokémon are kept in `state.pokedex`, a `Record<string, Pokemon>` keyed by name. `inspect` and `pokedex` read that map. They do not call the API again.

## Concepts

**REPL.** `readline.createInterface` prints `Pokedex> ` and listens for `line` events. The prompt is shown again after every command. `exit` closes the interface and then ends the process.

**Command registry.** Adding a command means writing a callback and registering it in `initState`. `help` walks the registry, so the menu stays in step with the commands that exist.

**Shared state.** Callbacks all receive the same `State`. `map` stores the next page URL there. `catch` writes into `pokedex` there. The next command sees those changes.

**Async I/O.** API calls use `fetch` and `async`/`await`. The REPL awaits the callback, so the next prompt appears only after the request finishes, and a failed request is caught and printed.

**Types that follow the JSON.** `Pokemon`, `Location`, and `ShallowLocations` describe the PokeAPI payloads. Nested fields stay nested: a stat's name is `stat.stat.name`, and a type's name is `type.type.name`, because that is the shape of the response.

**Pagination.** The location-area list includes a `next` URL. `map` requests that URL on the following call instead of counting pages itself.

**Catch chance.** After the Pokémon is loaded, the program prints the throw message and then rolls `Math.floor(Math.random() * base_experience)`. A roll above 40 is an escape. The Pokémon is stored only when the catch succeeds.

**In-memory cache with a time limit.** `PokeAPI` keeps responses in a `Cache` for 60 seconds, using the request URL as the key. A repeat visit to the same area or Pokémon is served from memory. A `setInterval` loop deletes entries older than the interval. `stopReapLoop` clears that timer, which the tests need so the process can exit.

**Generics and private fields.** `Cache.add<T>` and `Cache.get<T>` keep the stored value typed. The map, the interval, and the reap loop are `#` private fields of the class.

**Modules.** The project is an ES module (`"type": "module"`). Imports use the compiled `.js` extension even though the source files are `.ts`, because Node loads the output of `tsc` directly, without a bundler.

## Layout

```text
src/
  main.ts                 entry point
  repl.ts                 input loop and cleanInput
  state.ts                session state, command registry, Pokemon type
  pokecache.ts            timed in-memory cache
  APIs/pokeapi.ts         PokeAPI client
  commands/               one file per command
  repl.test.ts            tests for cleanInput and the cache
```

## Tests

`repl.test.ts` checks that `cleanInput` collapses extra spaces, and that a cache entry is readable immediately and gone after two reap intervals. Vitest is configured to run only `src/**/*.test.ts`.
