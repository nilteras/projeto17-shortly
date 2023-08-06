import { Router } from "express";
import { getDataUser } from "../controllers/users.controller.js";
import { authValidation } from "../middlewares/auth.middlewares.js";

const usersRouter = Router()

usersRouter.get('/users/me',authValidation ,getDataUser)
usersRouter.get('/ranking')

export default usersRouter