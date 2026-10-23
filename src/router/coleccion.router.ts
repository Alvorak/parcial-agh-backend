import { Router } from "express";
import { addMusicToColeccion, deleteColeccion, getColeccionById, getColecciones, patchColeccion, postColeccion, quitarMusicFromColeccion } from "../controller/coleccion.controller.js";

export const routerColeccion = Router();

routerColeccion.get("/", getColecciones);
routerColeccion.get("/:id", getColeccionById);

routerColeccion.post("/", postColeccion);
routerColeccion.post("/:id/musica", addMusicToColeccion)

routerColeccion.patch("/:id", patchColeccion);

routerColeccion.delete("/:id", deleteColeccion);

routerColeccion.delete("/:id/musica/:musicaId", quitarMusicFromColeccion)