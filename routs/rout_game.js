import { Game } from "../models/Game.js"

export async function nextRound(request, response) {
    try {
        const character_id = request.query.character_id
    
        const _deleted_effects = await Game.nextRound(character_id)

        response.send(_deleted_effects)

        
    } catch(error) {
        console.error(error.message)
    }
}