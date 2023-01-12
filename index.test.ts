import test from "ava";
import { IDBStore } from "./index";

type MyValue = {
  created: Date;
  name: string;
  age: number;
  hobbies: Set<string>;
};

test("It stores (structured data)", async (t) => {
  class MyValueStore extends IDBStore<MyValue> {}

  const store = new MyValueStore();
  const values = {
    created: new Date(),
    name: "test name",
    age: 12,
    hobbies: new Set(["gaming", "skating"]),
  };

  await store.setValue("test", { ...values });

  const { created, name, age, hobbies } = await store.getValue("test");

  t.deepEqual(created, values.created);
  t.deepEqual(hobbies, values.hobbies);
  t.is(name, values.name);
  t.is(age, values.age);

  await store.clear();
});

test("it has a list api", async (t) => {
  class MyListValue extends IDBStore<MyValue> {}

  const store = new MyListValue();
  const values = [];

  await store.clear();

  for (let i = 0; i < 50; i++) {
    const value = {
      created: new Date(Date.now() - i),
      name: `Item #${("00" + i).slice(-2)}`,
      age: i,
      hobbies: new Set<string>(),
    };
    values.push(value);
    await store.setValue(value.name, value);
  }

  const items = await store.getValues();
  t.is(items.length, 10, "The default length is 10");

  const items2 = await store.getValues(0, 25);
  t.is(items2.length, 25, "Length can be set");

  const items3 = await store.getValues(0, 100);
  t.is(items3.length, values.length, "Return all item if lenght > items");

  const [offset, max] = [13, 5];
  const items4 = await store.getValues(offset, max);

  t.deepEqual(items4, values.slice(offset, offset + max));
});
