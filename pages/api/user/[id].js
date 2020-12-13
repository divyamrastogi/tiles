import { connectToDatabase } from "../../../util/mongodb";
import { ObjectID } from "mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const {
    query: { id },
  } = req;
  console.log(id)
  const user = await db
    .collection("users")
    .findOne({ _id: ObjectID(id) });
  res.json(user);
}
