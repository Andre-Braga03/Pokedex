import { cleanInput } from "./repl.js";
import { describe, expect, test } from "vitest";
import {Cache} from "./pokecache.js";


test.concurrent.each([
  { key: "https://example.com", val: "testdata", interval: 500 },
  { key: "https://example.com/path", val: "moretestdata", interval: 1000 },
])("Test Caching $interval ms", async ({ key, val, interval }) => {
  const cache = new Cache(interval);
  cache.add(key, val);
  expect(cache.get(key)).toBe(val);
  await new Promise((resolve) => setTimeout(resolve, interval * 2 + 100));
  expect(cache.get(key)).toBe(undefined);
  cache.stopReapLoop();

});
describe.each([
  {
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  // TODO: more test cases here
]) // we'll do stuff here in a bit

describe.each([
  {
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  // TODO: more test cases here
])("cleanInput($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    // TODO: call cleanInput with the input here

    // The `expect` and `toHaveLength` functions are from vitest
    // they will fail the test if the condition is not met
    expect(cleanInput(input)).toHaveLength(expected.length);
    for (const i in expected) {
      // likewise, the `toBe` function will fail the test if the values are not equal
      expect(cleanInput(input)[i]).toBe(expected[i]);
    }
  });
});
