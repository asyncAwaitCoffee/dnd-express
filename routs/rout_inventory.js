import { Magic } from "../models/Magic.js"
import { Inventory } from "../models/Inventory.js"
import { PC } from "../models/PC.js"

export async function equipItem_GET(request, response) {
    try {
        const account_id = response.locals.account_id

        const equippedItemEffects = await Inventory.equipItem(request.query.character_id, request.query.cell_id)

        response.send(JSON.stringify(equippedItemEffects))

    } catch(error) {
        response.status(400).send()
        console.error(error)
    }
}

export async function unequipItem_GET(request, response) {
    try {
        const unequippedItemEffectId = await Inventory.unequipItem(request.query.character_id, request.query.cell_id)
        response.send(unequippedItemEffectId)

    } catch(error) {
        response.status(400).send()
        console.error(error)
    }
}

export async function deleteItem(request, response) {
    try {

        const deletedItemEffectId = await Inventory.deleteItem(request.query.character_id, request.query.cell_id)

        response.send(deletedItemEffectId ? [deletedItemEffectId] : [])

    } catch(error) {
        response.status(400).send()
        console.error(error)
    }
}

export async function useItem(request, response) {
    try {
        const character_id = request.query.character_id

        const result = await Inventory.useItem(character_id, request.query.cell_id)

        response.send(result)
         
    } catch(error) {
        response.status(400).send()
        console.error(error)        
    }
}

export async function spendItem(request, response) {
    try {

        const spenItem = await Inventory.spendItem(request.query.character_id, request.query.cell_id, request.query.amount)

        response.send(spenItem)        
    } catch(error) {
        response.status(400).send()
        console.error(error)        
    }
}