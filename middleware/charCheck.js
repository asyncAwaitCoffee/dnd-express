export async function characterCheck(request, response, next) {
    try {
        const character_id = request.query.character_id
        if (!response.locals.characters_list.includes(character_id)) {
            throw new Error(`Context: characterCheck(${character_id})\nNot found for this account!`)
        }
        next()
    } catch(error) {
        console.error(error)
        response.redirect("/account/list-of-characters")
    }
}