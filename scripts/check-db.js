const { MongoClient } = require("mongodb");

async function checkDb() {
  // Use the connection string from the .env file
  const uri =
    "mongodb+srv://limingjin777:wizard127811@cluster0.pqijcoq.mongodb.net/post-bot?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db();

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(
      "Collections in database:",
      collections.map((c) => c.name)
    );

    // Check each collection for the post
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\nChecking collection: ${collectionName}`);

      const coll = db.collection(collectionName);
      const count = await coll.countDocuments();
      console.log(`Total documents in ${collectionName}: ${count}`);

      if (count > 0) {
        const docs = await coll.find({}).limit(5).toArray();
        console.log(`Sample documents from ${collectionName}:`);
        docs.forEach((doc) => {
          console.log(
            JSON.stringify({
              id: doc._id,
              title: doc.title,
              slug: doc.slug,
              createdAt: doc.createdAt,
            })
          );
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

checkDb().catch(console.error);
