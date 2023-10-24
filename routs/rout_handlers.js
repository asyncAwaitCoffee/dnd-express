export async function home_GET(request, response) {
    try {
        response.render("home")
    } catch(error) {
        console.error(error)
    }
}