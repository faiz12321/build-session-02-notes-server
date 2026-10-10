import fs from 'node:fs';

export function createStore(file) {
  let notes = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  const save = () => fs.writeFileSync(file, JSON.stringify(notes, null, 2));

  return {
    all: () => notes,
    add(text) {
      const id = notes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
      const note = { id, text };
      notes.push(note);
      save();
      return note;
    },
    remove(id) {
      const before = notes.length;
      notes = notes.filter((n) => n.id !== id);
      if (notes.length === before) return false;
      save();
      return true;
    },
  };
}
