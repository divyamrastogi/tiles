import { ObjectID } from "mongodb";
import { connectToDatabase } from "../../../../util/mongodb";

export default async function handler(req, res) {
  const {
    query: { id },
  } = req;
  if (req.method === "PUT") {
    const body = JSON.parse(req.body);
    const path = body.path;
    if (path) {
      const { db } = await connectToDatabase();
      db.collection("users").findOneAndUpdate(
        { _id: ObjectID(id) },
        { $set: { profilePhotoPath: path } }
      );
      res.json({ url: path });
    } else {
      res.status(500).json({ message: "Image path not found!" });
    }
  }
}
