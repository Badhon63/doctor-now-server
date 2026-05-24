const express = require("express");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();
const app = express();
app.use(express.json());

const URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();
    const db = client.db("doctorNow");
    const collection = db.collection("doctorList");
    const appointmentsCollection = db.collection("appointments");

    app.get("/all-doctors", async (req, res) => {
      const result = await collection.find().toArray();
      res.send(result);
    });

    app.get("/doctors/:id", async (req, res) => {
      const result = await collection.findOne({ id: req.params.id });
      res.send(result);
    });

    app.post("/appointments", async (req, res) => {
      const data = req.body;
      result = await appointmentsCollection.insertOne(data);
      res.send(result);
    });
  } finally {
    //
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send({ status: true, message: "this is the server homepage" });
});

app.listen(PORT, () => {
  console.log("server started...");
});
