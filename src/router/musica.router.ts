import { Router } from "express";
import { deleteMusica, getMusica, getMusicaById, postMusica, putMusica } from "../controller/musica.controller.js";

export const routerMusica = Router();

routerMusica.get("/", getMusica);
routerMusica.get("/:id", getMusicaById);

routerMusica.post("/", postMusica);

routerMusica.put("/:id", putMusica);

routerMusica.delete("/:id", deleteMusica);