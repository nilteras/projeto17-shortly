import db from "../database/database.connection.js"

export async function getDataUser(req, res) {
       
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')
    const user = res.locals.user

    try {
        const { rows } = await db.query(`
        SELECT 
            users.id AS id,
            users.name AS name,
            SUM(urls.visit_count) AS "visitCount"
        FROM urls
        JOIN users ON urls."userId" = users.id
        WHERE users.id=$1
        GROUP BY users.id    
        `, [user.rows[0].id])

        const userData = rows[0]
        const { id, name, visitCount } = userData

        const urlData = await db.query(`
        SELECT
            urls.id AS id_url,
            urls.short_url AS "shortUrl",
            urls.url AS url,
            urls.visit_count AS "visitCount"
        FROM urls
        JOIN users ON urls."userId" = users.id
        WHERE users.id=$1
        GROUP BY urls.id
        `, [user.rows[0].id])

        const urls = urlData.rows.map(({ id_url, shortUrl, url, visitCount}) => ({
            id: id_url,
            shortUrl: shortUrl,
            url: url,
            visitCount: visitCount
        }))

        const result = {
            id,
            name,
            visitCount,
            shortenedUrls: urls
        }

        res.status(200).send(result)


    }catch (err) {
        res.status(500).send(err.message)
    }
}