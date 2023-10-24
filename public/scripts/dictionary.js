class Races {
    static #RACES = Object.freeze({
        2: {
            name: "Mountain Dwarf"
        },
        3: {
            name: "Hill Dwarf"
        } 
    })

    static getName(race_id) {
        if (race_id && this.#RACES[race_id]) {
            return this.#RACES[race_id].name
        }
    }

}

class Classes {
    static #CLASSES = Object.freeze({
        1: {
            name: "Barbarian",
            hpDice: 12
        },
        2: {
            name: "Druid",
            hpDice: 8
        }
    })

    static getName(class_id) {
        if (class_id && this.#CLASSES[class_id])
            return this.#CLASSES[class_id].name
    }
}