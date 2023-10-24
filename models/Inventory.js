import { DB } from "./DB.js";
import { Magic } from "./Magic.js";
import { InventoryException } from "./Wrappers.js"


export class Inventory {

    static async getInventory(character_id) {
        try {
            const equipable = []
            const nonequipable = []
            const inventory = await DB.queryRows(
                "select * from get_character_inventory($1)",
                    character_id
                )
            for (const item of inventory) {
                if (item.is_equipable) {
                    equipable.push(item)
                } else {
                    nonequipable.push(item)
                }
            }
            return {equipable, nonequipable}
        } catch(error) {
            throw new InventoryException(error.message, `getInventory(${character_id})`)
        }        
    }

    static async equipItem(character_id, cell_id) {
        try {
            const equippedItemEffect = await DB.queryRow(
                "call equip_item($1, $2, null, null, null, null)",
                    character_id,
                    cell_id
            )

            return equippedItemEffect
        } catch(error) {
            throw new InventoryException(error.message, `equipItem(${character_id}, ${cell_id})`)
        }
    }

    static async unequipItem(character_id, cell_id) {
        try {
            const { effect_id } = await DB.queryRow(
                "call unequip_item($1, $2, null)",
                    character_id,
                    cell_id
            )
            
            return effect_id

        } catch(error) {
            throw new InventoryException(error.message, `unequipItem(${account_id}, ${character_id}, ${cell_id})`)
        }
    }

    static async deleteItem(character_id, cell_id) {
        try {
            const { effect_id } = await DB.queryRow(
                "call delete_item($1, $2, null)",
                    character_id,
                    cell_id
            )

            return effect_id

        } catch(error) {
            throw new InventoryException(error.message, `deleteItem(${character_id}, ${cell_id})`)
        }

    }

    static async useItem(character_id, cell_id) {
        try {
            const usedItem = await DB.queryRow(
                "call use_item($1, $2, null, null, null, null, null, null, null, null, null)",
                    character_id,
                    cell_id
            )
            const result = await Magic.processMagicEffects(usedItem.effect_id, usedItem, character_id, character_id, 'consumable')

            result.is_deleted = usedItem.is_deleted

            return result

        } catch(error) {
            throw new InventoryException(error.message, `useItem(${character_id}, ${cell_id})`)
        }

    }

    static async spendItem(character_id, cell_id, amount) {
        try {
            const spentItem = await DB.queryRow(
                "call spend_item($1, $2, $3, null)",
                    character_id,
                    cell_id,
                    amount
            )

            return spentItem

        } catch(error) {
            throw new InventoryException(error.message, `spendItem(${character_id}, ${cell_id}, ${amount})`)
        }

    }

    static async getInventoryItem(character_id, cell_id) {
        const item = await DB.queryRow(
            "select * from get_inventory_item($1, $2)",
                character_id,
                cell_id
            )
        
        return item        
    }

    static async getEquipmentEffects(character_id) {
        let equipmentEffects = await DB.queryRows(
            "select * from get_equipment_effects($1)",
                character_id
            )
        return equipmentEffects
    }
}