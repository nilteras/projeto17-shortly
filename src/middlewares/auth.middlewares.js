import db from "../database/database.connection.js"
import { loginSchema, userSchema } from "../schemas/userSchema.js"
import bcrypt from 'bcrypt'

export async function SignUpValidation(req, res, next) {
    const user = req.body
   
    const { error } = userSchema.validate(user, { abortEarly: false })

    if (error) {
        const errorsMessage = error.details.map(detail => detail.message)
        return res.status(422).send(errorsMessage)
    }

    const checkUser = await db.query("SELECT * FROM users WHERE email=$1;", [user.email])
    if (checkUser.rowCount !== 0) return res.status(409).send("Esse email já esta cadastrado")

    res.locals.user = user

    next()
}

export async function SignInValidation(req, res, next) {

    const user = req.body

    const { error } = loginSchema.validate(user, { abortEarly: false })

    if (error) {
        const errorsMessage = error.details.map(detail => detail.message)
        return res.status(422).send(errorsMessage)
    }

    try {
        const checkUser = await db.query('SELECT * FROM users WHERE email =$1', [user.email])
        if (checkUser.rowCount === 0) return res.status(401).send('Email não localizado no cadastro!')

        const passwordCorrect = bcrypt.compareSync(user.password, checkUser.rows[0].password)
        if(!passwordCorrect) return res.status(401).send("Senha não confere")

        res.locals.user = user
        res.locals.checkUser = checkUser

    } catch (err) {
        return res.status(500).send(err.message)
    }

    next()
}

export async function authValidation(req, res, next){
    
   
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.status(401).send("Não autorizado")

    try {
        const session = await db.query("SELECT * FROM sessions WHERE token=$1;", [token])
        if(session.rows.length === 0) return res.status(401).send("Não autorizado")

        const user = await db.query("SELECT * FROM users WHERE id=$1;", [session.rows[0].userId])

        if (!user) return res.status(401).send("Não autorizado")

        res.locals.user = user

    } catch (err) {
        return res.status(500).send(err.message)
    }

    next()
}