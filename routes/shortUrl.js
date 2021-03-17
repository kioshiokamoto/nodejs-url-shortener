import express from "express";

import { getLongUrl, shortenerUrl } from "../controllers/url.js";

const router = express.Router();

//Publicacion de url en base de datos!
router.post("/", shortenerUrl)

//Redireccion de link corto a largo!
router.get('/:shortUrl', getLongUrl)

export default router;