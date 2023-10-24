import { User } from "../models/User.js";

export async function authCheck(request, response, next) {
    try {
        const data = await User.getAccountByToken(response.locals.parsedToken)
        response.locals.account_id = data.account_id
        response.locals.login = data.account_login
        response.locals.characters_list = data.characters_list
        next()
    } catch(error) {
        response.locals.login = null
        response.locals.account_id = null
        next()
    }
}