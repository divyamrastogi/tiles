import { connectToDatabase } from "util/mongodb";
import { ObjectID } from "mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const {
    query: { id },
  } = req;
  if (req.method === "POST") {
    const post = JSON.parse(req.body).post;
    await db.collection("posts").insertOne({ userId: ObjectID(id), post });
    res.json({ post });
  } else if (req.method === "GET") {
    const userPosts = await db
      .collection("posts")
      .find({ userId: ObjectID(id) })
      .toArray();

    const posts = userPosts.map(({ post }) => post);
    res.json(posts);
  } else {
    res.status(404).json({ message: "Method not supported." });
  }
}
