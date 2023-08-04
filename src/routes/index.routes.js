import { Router } from "express";
import authRouter from "./auth.routes.js";
import urlRouter from "./url.routes.js";
import usersRouter from "./users.routes.js";


const router = Router()

router.use(authRouter)
router.use(urlRouter)
router.use(usersRouter)

export default router;