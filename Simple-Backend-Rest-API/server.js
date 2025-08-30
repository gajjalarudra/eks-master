import express from "express";

const app = express();
const PORT = 8080;

app.get("/hello", (req, res) => {
  res.send("hey there I am rest api from EKS");
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
