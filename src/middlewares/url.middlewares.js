import { urlSchema } from "../schemas/urlSchema.js"

export async function UrlValidation(req, res, next) {
    
    const url = req.body.url

    const { error } = urlSchema.validate({url} , { abortEarly: false })

    if (error) {
        const errorsMessage = error.details.map(detail => detail.message)
        return res.status(422).send(errorsMessage)
    }

    res.locals.url = url

    next()
}