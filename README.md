# idb-store
Small wrapper for typed stores with indexDB


### Usage

This is nothign but a small wrapper around [idb-keyval](https://github.com/jakearchibald/idb-keyval), but adds a [Generic Class](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-classes) wrapper. This reduces type-marshalling a bit. It's convenient enough to have, and nice to not have sitting around in your codebase.

See the [index.test.ts](./index.test.ts) for how this is used:

```typescript
import { IDBStore } from "./index";

type MyValue = {
    created: Date;
    name: string;
    age: number;
    hobbies: Set<string>;
}

class MyValueStore extends IDBStore<MyValue> { }

const store = new MyValueStore();
const values = { created: new Date(), name: "test name", age: 12, hobbies: new Set(["gaming", "skating"]) };

// typescript will warn if you try to set something that does not look like a 'MyValue'
await store.setValue("test", { ...values });

// typescript will know the types of created, name, age...
const { created, name, age, hobbies } = await store.getValue("test");

// idb supports structured cloning
t.deepEqual(created, values.created);
t.deepEqual(hobbies, values.hobbies);
t.is(name, values.name);
t.is(age, values.age);

await store.clear();

```