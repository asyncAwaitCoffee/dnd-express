import { User } from "../models/User.js";

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
    response.render("login.ejs")
}

export async function login_POST(request, response) {
    try {
        const token = await User.getAccountToken(request.body.login, request.body.password)
        response.cookie("test", token, {httpOnly: true, maxAge: 4 * 60 * 60 * 1000, signed: true })        
        response.send({ok: true})
    } catch(error) {
        console.log(error)
        response.send({text: error.hint})
    }
}

export function logout_GET(request, response) {
    response.cookie("test", "", {httpOnly: true, maxAge: 1 })
    response.redirect("/auth/login")
}

export function account_GET(request, response) {    
    response.render("ac_info")
}