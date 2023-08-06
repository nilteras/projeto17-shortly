import { nanoid } from "nanoid"
import db from "../database/database.connection.js"

export async function createUrlShort(req, res) {
    
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')

    const url = res.locals.url
    const user = res.locals.user

    const shortUrl = nanoid(8)

    try {
        await db.query(`INSERT INTO urls ("userId", url, short_url) VALUES ($1, $2, $3);`, [user.rows[0].id, url, shortUrl])
        
        const post = await db.query("SELECT * FROM urls WHERE short_url=$1;", [shortUrl])

        res.status(201).send({ id: post.rows[0].id, shortUrl})

    } catch (err) {
        res.status(500).send(err.message)
    }

}

export async function getUrlById(req, res) {

    const { id } = req.params

    try {
        const idUrl = await db.query("SELECT * FROM urls WHERE id=$1;", [id])

        if(idUrl.rows.length === 0) return res.sendStatus(404)

        res.send({id: idUrl.rows[0].id, shortUrl: idUrl.rows[0].short_url, url: idUrl.rows[0].url})
    }catch (err) {
        res.status(500).send(err.message)
    }
} 