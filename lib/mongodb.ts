import { MongoClient, Db } from "mongodb";

// ─── تنظیمات اتصال ─────────────────────────────────────────────────────────
// فقط این متغیر را در فایل .env.local وارد کنید:
//   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

const uri = process.env.MONGODB_URI as string;
const DB_NAME = process.env.MONGODB_DB || "portfolio";

if (!uri) {
  throw new Error(
    "لطفاً متغیر MONGODB_URI را در فایل .env.local تنظیم کنید"
  );
}

// ─── Singleton برای جلوگیری از ایجاد اتصال‌های اضافه ──────────────────────
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const c = await clientPromise;
  return c.db(DB_NAME);
}

export default clientPromise;
