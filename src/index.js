export class VectorStore {
  constructor() { this.items = new Map(); }
  upsert(id, vector, metadata = {}) {
    if (!Array.isArray(vector) || vector.some(Number.isNaN)) throw new Error("vector must be numeric");
    this.items.set(id, { id, vector, metadata });
  }
  search(query, { topK = 5, filter = {} } = {}) {
    return [...this.items.values()]
      .filter((item) => Object.entries(filter).every(([key, value]) => item.metadata[key] === value))
      .map((item) => ({ ...item, score: cosine(query, item.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
  snapshot() { return JSON.stringify([...this.items.values()]); }
  static restore(text) {
    const store = new VectorStore();
    for (const item of JSON.parse(text)) store.upsert(item.id, item.vector, item.metadata);
    return store;
  }
}
export function cosine(a, b) {
  let dot = 0, an = 0, bn = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) { dot += a[i] * b[i]; an += a[i] ** 2; bn += b[i] ** 2; }
  return an && bn ? dot / (Math.sqrt(an) * Math.sqrt(bn)) : 0;
}
