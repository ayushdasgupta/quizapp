import { openDB } from 'idb';

const DB_NAME = "QuizResultsDB";
const STORE_NAME = "results";

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveResult = async (user:string,score: number, total: number) => {
  const db = await initDB();
  await db.add(STORE_NAME, {user, score, total, timestamp: new Date().toISOString() });
};

export const getResults = async (user:string) => {
  const db = await initDB();
  const allResults= await db.getAll(STORE_NAME);
  return allResults.filter((result)=>result.user===user)

};
