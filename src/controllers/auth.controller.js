import db from "../database/database.connection.js"
import bcrypt from 'bcrypt'
import { v4 as uuid } from "uuid"

export async function signUp(req, res) {

    const { name, email, password } = req.body

    try {
        const emailExist = await db.query("SELECT * FROM users WHERE email=$1;", [email])
        if(emailExist.rows.length > 0) return res.status(409).send('Email já cadastrado')

        const hash = bcrypt.hashSync(password, 10)

        await db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3);", [name, email, hash])

        res.status(201).send("Cadastro efetuado com sucesso")


    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function signIn (req,res){
    const { email, password } = req.body

    const userToken = uuid()

    try{
        const user = await db.query("SELECT * FROM users WHERE email=$1;", [email])
        if(user.rows.length === 0) return res.status(404).send('Email não cadastrado')

        const correctPassword = bcrypt.compareSync(password, user.password)
        if(!correctPassword) return res.status(401).send("Senha incorreta")

        await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`, [user.rows[0].id, userToken])
        res.status(200).send({ token: userToken})

    }catch (err) {
        res.status(500).send(err.message)
    }
}