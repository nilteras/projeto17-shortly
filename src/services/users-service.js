import { usersRepository } from "../repository/users-repository"

async function getDataUser(user) {
       return usersRepository.getDataUserDB(user);
}

async function getRanking(){
       return usersRepository.getRankingDB()
}

export const usersService = {
    getDataUser,
    getRanking
}