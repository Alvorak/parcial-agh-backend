import express from "express";
import { routerMusica } from "./router/musica.router.js";
import { routerColeccion } from "./router/coleccion.router.js";

const app = express();

app.use(express.json());

app.use("/musica", routerMusica);
app.use("/colecciones", routerColeccion);

const PORT = 1986;
app.listen(PORT, () => {
    console.log(`It's a strange world, isn't it?  Even my API is running on port ${PORT}.`);
});