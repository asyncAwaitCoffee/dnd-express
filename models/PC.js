import { abilityMod } from "../scripts/formulas.js"
import { DB } from "./DB.js";
import { Classes, Races } from "./Dictionary.js";
import { PCException } from "./Wrappers.js"

export class PC {
    //TODO: добавить методы работы с БД
    constructor(data, proficiencies) {
        try {
            this.character_name = data.character_name ?? ""
            this.race_id = data.race_id || 2
            this.main_class_id = data.main_class || 1
            this.main_level = data.main_level || 1
            this.speed = Races.getStats(this.race_id).speed
            this.proficiencies = proficiencies
            this.effects = data.item_effects
            this.statsData = data.stat_abilities
            this.str = data.str ?? 1
            this.dex = data.dex ?? 1
            this.con = data.con ?? 1
            this.int = data.int ?? 1
            this.wis = data.wis ?? 1
            this.cha = data.cha ?? 1
            this.max_hp = data.max_hp || Classes.getHpForClassLevel(this.main_class_id, this.main_level, abilityMod(this.con))
            this.current_hp = data.current_hp || Classes.getHpForClassLevel(this.main_class_id, this.main_level, abilityMod(this.con))
            this.spell_slots_max = data.spell_slots_max || Classes.getSpellMaxSlots(this.main_class_id, this.main_level)
            this.spell_slots = data.spell_slots || Classes.getSpellMaxSlots(this.main_class_id, this.main_level)
            this.colors = Classes.getClassColor(this.main_class_id)
            this.spells_background = Classes.getSpellsBackground(this.main_class_id)
        } catch(error) {
            console.log(error)
            throw new PCException(error.message, `new PC(${data})`)
        }
    }

    static async makeLongRest(character_id) {
        try {
            const result = await DB.queryRow(
                "call long_rest($1, null, null, null, null, null)",
                    character_id

            )
            return result
        } catch(error) {
            throw new PCException(error.message, `makeLongRest(${character_id})`)
        }
    }

    static async getCharactersList(account_id) {
        try {
            const charactersList = await DB.queryRows(
                "select * from get_characters_list($1)",
                    account_id
                )
            return charactersList
        } catch(error) {
           throw new PCException(error.message, `getCharactersList(${account_id})`)
        }
    }

    static async getCharacterStats(character_id) {
        try {
            const stats = await DB.queryRow(
                "select * from get_character_stats($1)",
                    character_id
                )
            return stats
        } catch(error) {
            throw new PCException(error.message, `getStats(${character_id})`)
        }
    }

    static async getCharacterClassFeatures(character_id) {
        try {
            const features = await DB.queryRows(
                "select * from get_character_class_features($1)",
                    character_id
                )

            return features
        } catch(error) {
            throw new PCException(error.message, `getClassFeatures(${character_id})`)
        }
    }

    static async getClassProficiencies(character_id) {
        try {
            const proficiencies = await DB.queryRows(
                "select * from get_class_proficiencies($1)",
                    character_id
                )
            return proficiencies
        } catch(error) {
            throw new PCException(error.message, `getClassProficiencies(${character_id})`)
        }
    }

    static async getAbilityScores(account_id, character_id) {
        try {
            const stats = await DB.queryRow(
                "select * from get_ability_scores($1::bigint, $2::bigint)",
                    account_id,
                    character_id
                )
            return stats
        } catch(error) {
            throw new PCException(error.message, `get_ability_scores(${account_id}, ${character_id})`)
        }
    }

    static async saveToDB(account_id, character) {
        try {
            const { character_id } = await DB.queryRow(
                "call create_new_character($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, null)",
                    account_id,
                    character.character_name,
                    character.race_id,
                    character.main_class_id,
                    character.main_level,
                    character.str,
                    character.dex,
                    character.con,
                    character.int,
                    character.wis,
                    character.cha,
                    character.max_hp,
                    character.spell_slots_max
            )

            await DB.queryRow(
                "call add_class_features($1, $2)",
                    character_id,
                    character.main_class_id
            )

            await DB.queryRow(
                "call add_class_items($1, $2)",
                    character_id,
                    character.main_class_id
            )

            return true
        } catch (error) {
            throw new PCException(error.message, `saveToDB(${account_id}, ${character})`)
        }
    }

    static async deleteCharacter(account_id, character_id) {
        try {   
            await DB.queryRow(
                "call delete_character($1, $2)",
                    account_id,
                    character_id
                )
        } catch(error) {
            throw new PCException(error.message, `deleteCharacter(${character_id})`)
        }
    }
}