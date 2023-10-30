import { DB } from "./DB.js";
import { UserException } from "./Wrappers.js";
//import { passwordSecret } from "../config/config.js"
//import { passwordSecret } from "/etc/secrets/config.js"
import pkg from '/etc/secrets/config.js';
const { passwordSecret } = pkg

const { createHmac } = await import('node:crypto');



export class User {
    constructor(login, password) {

        if (password.length < 4)
            throw new UserException("Password length <4.", `new User(${login}, ${password})`, "Password should be at least 4 symbols long!")

        this.login = login
        this.password = password
    }

    static async #secret(password) {
        const secret = passwordSecret;
        const hashedPassword = await createHmac("sha256", secret)
                   .update(password)
                   .digest("hex")
        return hashedPassword
    }

    static async saveToDB(user) {
        try {
            const hashedPassword = await this.#secret(user.password)
            const token = await DB.queryRow(
                "call create_new_account($1, $2, null)",
                    user.login,
                    hashedPassword
                )
            return token.account_token
        } catch(error) {
            throw new UserException(error.message, `saveToDB(${user})`, "Please, try another name for login!")
        }
    };

    static async getAccountToken(login, password) {
        try {
            const hashedPassword = await this.#secret(password)
            const { account_token } = await DB.queryRow(
                "select * from get_account_token_by_login($1, $2)",
                    login,
                    hashedPassword
                )
            return account_token
        } catch(error) {
            throw new UserException(error.message, `getAccountToken(${login}, ${password})`, "No such login-password pair.")
        }
    }
    
    static async getAccountByToken(token) {
        try {
            const data = await DB.queryRow(
                "select * from get_account_by_token($1)",
                    token
                )
            return data
        } catch(error) {
            throw new UserException(error.message, `getAccountByToken(${token})`)
        }        
    }

    static async findUser(account_uuid) { // ?? нужен
        try {
            await DB.queryRow(
                "select * from get_user_by_id($1)", // ?? без возвращения данных?
                    account_uuid
                )
            return true
        } catch(error) {
            throw new UserException(error.message)
        }
    }

    static async getLogin(account_uuid) {
        try {
            const data = await DB.queryRow(
                "select * from get_login_by_uuid($1)",
                    account_uuid
                )
            return data.get_login_by_uuid
        } catch(error) {
            throw new UserException(error.message)
        }
    }

    static async getAccountID(UUID) {
        if (!UUID) {
            throw new UserException('Passed UUID is empty.', `getAccountID(${UUID})`)
        }
        try {
            const data = await DB.queryRow(
                "select * from get_account_id_by_uuid($1)",
                    UUID
                )
            return data.get_account_id_by_uuid
        } catch(error) {
            throw new UserException(error.message, `getAccountID(${UUID})`)
        }
    }
}