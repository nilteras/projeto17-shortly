import { usersService } from "../services/users-service";

export async function getDataUser(req, res) {

    const user = res.locals.user
    try {
        usersService.getDataUser(user);
    }catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getRanking(req, res){

    try {
       usersService.getRanking();
    } catch (err) {
        res.status(500).send(err.message)
    }
}