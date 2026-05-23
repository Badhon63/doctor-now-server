const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ status: true, message: "this is the server homepage" });
});

app.listen(PORT, () => {
  console.log("server started...");
});
