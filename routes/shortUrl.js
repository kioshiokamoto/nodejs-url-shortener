import express from "express";
import shortid from "shortid";
import validUrl from "valid-url";
import config from "config";

import Url from "../models/Url.js";
import e from "express";

const router = express.Router();

router.post("/", async  (req,res)=>{
    const longUrl = req.body.longUrl;
    const baseUrl = "http://localhost:5000/app"

    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json("Error interno. Por favor regresa más tarde.");
    }

    const urlCode = shortid.generate();
    if(validUrl.isUri(longUrl)){
        try {
            let url = await Url.findOne({longUrl : longUrl});
            if(url){
                return  res.status(200).json(url);
            }else{
                const shortUrl = baseUrl + "/" + urlCode;
                //Probar ponerlo de la otra forma
                url  = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    clickCount: 0
                });
                await url.save();
                return res.status(201).json(url);
            }
        } catch (error) {
            console.error(err.message);
            return res.status(500).json("Error interno de servidor " + err.message);
        }
    }else{
        res.status(400).json("URL invalida. Ingrese una URL válida para acortar.");
    }

})

router.get('/:shortUrl', async (req,res)=>{
    let shortUrlCode = req.params.shortUrl;
    let limitCount =200; //Esto se puede establecer
    
    try {
        let url = await Url.findOne({ urlCode: shortUrlCode });
        if (url) {
            let clickCount = url.clickCount;
            if(clickCount >= limitCount){
                console.log("El recuento de clicks para shortcode " + shortUrlCode + " ha pasado el límite de " + limitCount);
                return res.status(400).json("La cantidad de clicks para shortcode " + shortUrlCode + " ha pasado el límite de " + limitCount);
            }
            clickCount++;
            await url.update({ clickCount });
            return res.redirect(url.longUrl);
        }else{
            return res.status(400).json("La URL corta no existe en nuestro sistema.");
        }

    } catch (error) {
        console.error("Error al recuperar la URL para shorturlcode " + shortUrlCode);
        return res.status(500).json("Existe algún error interno.");
    }
})

export default router;