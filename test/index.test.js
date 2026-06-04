import test from "node:test";
import assert from "node:assert/strict";
import { VectorStore } from "../src/index.js";
test("search ranks similar vectors", () => {
  const store = new VectorStore();
  store.upsert("a", [1, 0], { type: "doc" });
  store.upsert("b", [0, 1], { type: "doc" });
  assert.equal(store.search([0.9, 0.1])[0].id, "a");
});
test("snapshot restores data", () => {
  const store = new VectorStore();
  store.upsert("x", [1, 2, 3]);
  assert.equal(VectorStore.restore(store.snapshot()).search([1, 2, 3])[0].id, "x");
});
