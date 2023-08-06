import { Router } from "express";
import { authValidation } from "../middlewares/auth.middlewares.js";
import { UrlValidation } from "../middlewares/url.middlewares.js";
import { createUrlShort, getUrlById } from "../controllers/url.controller.js";


const urlRouter = Router()

urlRouter.post('/urls/shorten', authValidation, UrlValidation, createUrlShort)
urlRouter.get('/urls/:id', getUrlById)
urlRouter.get('/urls/open/:shortUrl')
urlRouter.delete('/urls/:id', authValidation)

export default urlRouter