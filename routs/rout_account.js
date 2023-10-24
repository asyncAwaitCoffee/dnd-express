import path from "path"
import { fileURLToPath } from "url";
import { User } from "../models/User.js";


//const __filename = fileURLToPath(import.meta.url);
//const __dirname = `${path.dirname(__filename)}\\..\\html`;

export function signup_GET(request, response) {
    response.render("signup.ejs")
}

export async function signup_POST(request, response) {
    try {
        const user = new User(request.body.login, request.body.password)
        await User.saveToDB(user)
        
        response.send({ok: true})
    } catch(error) {
        console.log(error)
        response.send({text: error.hint})
    }
}

export function login_GET(request, response) {
    response.locals.hint = "Enter yor login here"
    response.render("login.ejs")
}

export async function login_POST(request, response) {
    try {
        const token = await User.getAccountToken(request.body.login, request.body.password)

        if (token) {
            response.cookie("test", token, {httpOnly: true, maxAge: 4 * 60 * 60 * 1000, signed: true })
            response.redirect("/account/list-of-characters")
        } else {
            response.redirect("/")
        }
    } catch(error) {
        console.log(error)
        response.locals.hint = "No such login-password pair"
        response.render("login.ejs")
    }
}

export function logout_GET(request, response) {
    response.cookie("test", "", {httpOnly: true, maxAge: 1 })
    response.redirect("/auth/login")
}

export function account_GET(request, response) {    
    response.render("ac_info")
}