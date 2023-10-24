import { PC } from "../models/PC.js";
import { Inventory } from "../models/Inventory.js";
import { Magic } from "../models/Magic.js";
import { Features } from "../models/Features.js";


export function newCharacter_GET(request, response) {
    response.render("pc_new")
}

export async function newCharacter_POST(request, response) {
    try {
        const account_id = response.locals.account_id

        if (account_id) {
            await PC.saveToDB(account_id, new PC(request.body))
        }        

        response.status(200).redirect("/account/list-of-characters")
    } catch(error) {
        console.error(error)
        response.status(400).send()
    }
}

export async function getCharactersList_GET(request, response) {
    try {
        const account_id = response.locals.account_id
        const charactersList = await PC.getCharactersList(account_id)

        response.locals.charactersList = charactersList

        response.render("../views/pc_list.ejs")

    } catch(error) {
        console.log(error)
        response.status(400).send()
    }
}

export async function getCharacter_GET(request, response) {
    try {
        const character_id = request.query.character_id

        const stats = await PC.getCharacterStats(character_id)
        const classFeatures = await PC.getCharacterClassFeatures(character_id)
        const classProficiencies = await PC.getClassProficiencies(character_id)
        const customFeatures = await Features.getCustomFeatures(character_id)

        const inventory = await Inventory.getInventory(character_id)
        const equipmentEffects = await Inventory.getEquipmentEffects(character_id)
        const spellList = await Magic.getCharacterSpells(character_id)

        const characterEffects = await Magic.getCharacterEffects(character_id)
        response.locals.customFeatures = customFeatures
        response.locals.classFeatures = classFeatures
        response.locals.pc = new PC(stats, classProficiencies)

        response.locals.stats = stats
        response.locals.equipmentEffects = equipmentEffects
        response.locals.characterEffects = characterEffects

        response.locals.equipable = inventory.equipable
        response.locals.nonequipable = inventory.nonequipable
        response.locals.spellList = spellList

        response.render("../views/pc_info.ejs")
    } catch(error) {
        console.log(error)
        response.status(400).send()
    }
}

export async function deleteCharacter_GET(request, response) {
    try {

        await PC.deleteCharacter(response.locals.account_id, request.query.character_id)

        response.status(200).redirect("/account/list-of-characters")
    } catch(error) {
        console.error(error)
        response.status(400).send()
    }
}

export async function restoreHP(request, response) {
    try {
        const character_id = request.query.character_id
        const flat = Number(request.query.flat) || 0
        const dices = request.query.dices
        
        const result = await Magic.processMagicEffects(-1, {base_effects: {current_hp: {flat, dices}}}, character_id, character_id, "direct")

        response.send(result)
        
    } catch(error) {
        console.error(error)        
        response.status(400).send()
    }
}

export async function longRest_GET(request, response) {
    try {
        const character_id = request.query.character_id

        const rested = await PC.makeLongRest(character_id)
        response.send(rested)

    } catch(error) {
        console.error(error)
        response.status(400).send()
    }
}