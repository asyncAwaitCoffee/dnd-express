export class Races {
    static #RACES = Object.freeze({
        2: {//name: "Mountain Dwarf",
            stats: {
                speed: 20
            }
        },
        3: {//name: "Hill Dwarf",
            stats: {
                speed: 25
            }
        } 
    })

    static getStats(race_id) {
        if (race_id && this.#RACES[race_id]) {
            return this.#RACES[race_id].stats
        }
        return {}
    }
}

export class Classes {
    static #CLASSES = Object.freeze({
        1: {
            name: "Barbarian",
            hp_dice: 12,
            spell_slots: [3,3,1],
            color: {main: "rgb(241, 161, 0)", sub: "rgb(160, 20, 20, 0.9)"},
            spells_background: "magic_barbarian"
        },
        2: {
            name: "Druid",
            hp_dice: 8,
            spell_slots: [4,3,3,3,3,2,2,1,1],
            color: {main: "rgb(218, 165, 32)", sub: "rgb(0, 128, 0, 0.9)"},
            spells_background: "magic_druid"
        },
    })

    static getName(class_id) {
        if (class_id && this.#CLASSES[class_id])
            return this.#CLASSES[class_id].name
    }

    static getHpDice(class_id) {
        if (class_id && this.#CLASSES[class_id])
            return this.#CLASSES[class_id].hp_dice
    }

    static getHpForClassLevel(class_id, level, mod) {
        if (class_id && this.#CLASSES[class_id])
            return this.#CLASSES[class_id].hp_dice + ((this.#CLASSES[class_id].hp_dice / 2) + 1) * (level - 1) + mod * level
    }

    static getSpellMaxSlots(class_id, level) {  //level dependency
        if (class_id && this.#CLASSES[class_id])
            return this.#CLASSES[class_id].spell_slots
    }

    static getClassColor(class_id) {
        if (class_id && this.#CLASSES[class_id])
            return this.#CLASSES[class_id].color
    }

    static getSpellsBackground(class_id) {
        if (class_id && this.#CLASSES[class_id])
            return this.#CLASSES[class_id].spells_background
    }
}