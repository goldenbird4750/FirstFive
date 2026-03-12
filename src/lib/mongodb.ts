import mongoose, { mongo } from "mongoose";
const MONGODB_URL = process.env.MONGODB_URL!;
if(!MONGODB_URL){
  throw new Error("MONGODB_URL  is not defined in .env.local")
}


interface MongooseCache{
  conn:typeof mongoose |null;
  promise:Promise<typeof mongoose>|null;
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const cached : MongooseCache = global.mongooseCache || {conn:null , promise:null};


if(!global.mongooseCache){
  global.mongooseCache = cached
}



export async function connectDb () {
  if(cached.conn){
    return cached.conn

  }
  if(!cached.promise){
    cached.promise = mongoose.connect(MONGODB_URL, {bufferCommands:false});

  }

cached.conn = await cached.promise
return cached.conn;


}