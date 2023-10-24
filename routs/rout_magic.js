import { Magic } from "../models/Magic.js"

export async function castSpell (request, response) {
    try {
        const account_id = response.locals.account_id
        const character_id = request.query.character_id
        const target_id = request.query.target_id
        const spell_id = request.query.spell_id

        const castedSpell = await Magic.castSpell(character_id, target_id, spell_id)

        response.send(castedSpell)
        
    } catch(error) {
        console.error(error)
        response.status(400).send()
    }
}