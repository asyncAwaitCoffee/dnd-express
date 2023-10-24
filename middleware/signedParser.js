import cookieParser from 'cookie-parser'

export const secretCookieParser = cookieParser("cookie has secrets")

export function parseSignedLogin(request, response, next) {
    try {
        request.parsedLogin = secretCookieParser.signedCookie(request.signedCookies.test)
        if (!request.parsedLogin && request.url != '/') {
            throw Error("Could not parse the login cookie.")
        }
        next()
    } catch(error) {
        console.log(error)
        response.redirect("/login")
    }
}