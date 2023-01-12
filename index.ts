import { set, get, createStore, UseStore, values, clear } from "idb-keyval";

export abstract class IDBStore<ItemType> {
  private db: UseStore;

  constructor() {
    const objectName = this.constructor.name;
    this.db = createStore(`store#${objectName}`, objectName);
  }

  async getValue(pk: string): Promise<ItemType> {
    const value = await get(pk, this.db);
    return value;
  }

  async setValue(pk: string, value: ItemType): Promise<void> {
    await set(pk, value, this.db);
  }

  async getValues(offset = 0, max = 10): Promise<ItemType[]> {
    return (await values(this.db)).slice(offset, offset + max);
  }

  clear() {
    return clear(this.db);
  }
}
