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
    const users = db.collection("user");

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
      const result = await appointmentsCollection.insertOne(data);
      res.send(result);
    });

    app.get("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const result = await appointmentsCollection.find().toArray();
      res.send(result);
    });

    app.patch("/appointments/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const newData = {
        $set: {
          name: data.name,
          date: data.date,
          time: data.time,
          reason: data.reason,
        },
      };
      const result = appointmentsCollection.updateOne(query, newData);
      res.send(result);
    });

    app.delete("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await appointmentsCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/user/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      console.log(data, id);
      const query = {
        _id: new ObjectId(id),
      };
      const newData = {
        $set: {
          name: data.name,
          image: data.image,
        },
      };
      const result = users.updateOne(query, newData);
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
