import { DB } from "./DB.js";
import { GameException } from "./Wrappers.js";

export class Game {
    static async nextRound(character_id) {

        try {
            const deleted_effects = await DB.queryRow(
                "call next_round($1, null, null)",
                character_id
            )

        return deleted_effects

        } catch(error) {
            throw new GameException(error.message, `processMagicEffects(${character_id})`)
        }
    }

}