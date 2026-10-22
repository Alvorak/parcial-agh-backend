import express from "express";
const app = express();

app.use(express.json());

const PORT = 1986;
app.listen(PORT, () => {
    console.log(`🌹 It's a strange world, isn't it?  Even my API is running on port ${PORT}.`);
});