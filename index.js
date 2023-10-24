import express from "express"
import { router } from './routs/routs.js'
import { authCheck } from "./middleware/authCheck.js"
import cookieParser from 'cookie-parser'
import { characterCheck } from "./middleware/charCheck.js";

const app = express();
const port = 3000;

app.use(express.static("public"))
app.use("/account/character/", express.static("public"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));    // extended ??
app.use(cookieParser("cookie has secrets"))
app.set('view engine', 'ejs');

app.get("/", parseAccountToken, authCheck)
app.all("/account/*", parseAccountToken, authCheck)
app.all("/account/character/*", characterCheck)
app.all("/auth/*", authCheck)
app.use(router)

app.listen(port, function() {
    console.log(`App is listening at port ${port}.`)
})

function parseAccountToken(request, response, next) {
    try {
        response.locals.parsedToken = cookieParser.signedCookie(request.signedCookies.test)
        if (!response.locals.parsedToken && request.url != '/') {
            throw Error("Could not parse the login cookie.")
        }
        next()
    } catch(error) {
        response.redirect("/auth/login")
    }
}