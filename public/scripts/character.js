class PC {
    static #playerCharacter = null

    constructor(data) {          
        try {
            this.character_name = data.character_name
            this.race_name = Races.getName(data.race_id)
            this.race_id = data.race_id
            this.main_class_name = Classes.getName(data.main_class_id)
            this.main_class = data.main_class
            this.main_level = data.main_level
            this.tempHP = 0
            this.ac = 0
            this.initiative = 0
            this.speed = data.speed
            this.proficiency = calcProficiency(this.main_level)
            this.proficiencies = data.proficiencies
            this.str = new PCStat(data.str)
            this.dex = new PCStat(data.dex)
            this.con = new PCStat(data.con)
            this.int = new PCStat(data.int)
            this.wis = new PCStat(data.wis)
            this.cha = new PCStat(data.cha)
            this.maxHP = data.max_hp
            this.currentHP = data.current_hp
            this.spell_slots_max = data.spell_slots_max
            this.spell_slots = data.spell_slots
        } catch(error) {
            throw new Error(error.message, `new PC(${data})`)
        }
    }
    
    static getPlayerCharacter(data) {
        if (!this.#playerCharacter) {
            this.#playerCharacter = new PC(data)
        }
        return this.#playerCharacter
    }

    initMe() {
        AttributesRelated.setAll()
        refreshCharacterData2()

        document.querySelector("#stats-header").textContent = `${this.character_name} (${this.race_name})`
        document.querySelector("#features-header").textContent = `${this.main_class_name} (lvl ${this.main_level})`
    }
}

class PCStat {
    constructor(value) {
        this.mod = abilityMod(value)
        this.val = value
    }

    getModString(value) {
        let total = this.mod + (value || 0)
        return total >= 0 ? `+${total}` : `${total}`
    }

    getMod() {
        return this.mod
    }

    getValue() {
        return this.val
    }
}

class RefreshCharacter2 {

    static accuracy(value) {

        const profBonus = myPC.proficiency //TODO: weapon prof check

        const el_strAccuracy = document.getElementById("str-attack")
        const el_dexAccuracy = document.getElementById("dex-attack")

        el_strAccuracy.innerText = this.#getSignedString(value, myPC.str.getMod() + profBonus)
        el_dexAccuracy.innerText = this.#getSignedString(value, myPC.dex.getMod() + profBonus)
    }

    static damage(value) {
        const el_strDamage = document.getElementById("str-damage")
        const el_dexDamage = document.getElementById("dex-damage")

        el_strDamage.innerText = this.#getSignedString(value, myPC.str.getMod())
        el_dexDamage.innerText = this.#getSignedString(value, myPC.dex.getMod())
    }

    static armor_class(value) {
        //TODO: abilityScores влияет при лёгкой броне или при классовых умениях без доспеха и.т.п.
        const el_ac = document.getElementById("ac")
        el_ac.textContent = this.#getString(value, 0, "")
    }

    static current_hp(value) {
        myPC.currentHP = value.flat
        const el_currentHP = document.querySelector("#current_hp")
        el_currentHP.textContent = myPC.currentHP
    }

    static max_hp(value) {
        myPC.maxHP = value.flat
        const el_maxHP = document.querySelector("#max_hp")
        el_maxHP.textContent = value.flat
    }

    static temp_hp() {
        const el_tempHP = document.querySelector("#temp_hp")
        el_tempHP.textContent = myPC.tempHP
    }

    static initiative(value) {
        const el_initiative = document.querySelector("#initiative")
        el_initiative.textContent = this.#getSignedString(value)
    }

    static speed(value) {
        myPC.speed = value.flat
        const el_speed = document.querySelector("#speed")
        el_speed.textContent = value.flat
    }

    static proficiency() {
        const el_proficiency = document.querySelector("#proficiency")
        el_proficiency.textContent = this.#getSignedString({flat: myPC.proficiency})
    }

    static spell_slots_actual(slots) {
        for (const slot in slots.flat) {
            const el_slot = document.querySelector(`#spell_slot_${Number(slot) + 1}`)
            el_slot.innerText = slots.flat[slot]
        }
    }

    static #getString(value, bonus = 0) {
        return this.#getSignedString(value, bonus, "")
    }

    static #getSignedString(value, bonus = 0, positive = "+") {
        let diceString = ''
        for (const dice in value.dices) {
            if (value.dices[dice] > 0) {
                diceString += `[${value.dices[dice]}d${dice}]`
            }                
        }

        let totalFlat = bonus + value.flat
        let flatString = (totalFlat >= 0 ? `${positive}${totalFlat}` : `${totalFlat}`)

        return diceString + flatString
    }

}

class AttributesRelated {
    static setAll() {
        const modBasedAttributes = [...document.querySelectorAll(".mod-based")]
        modBasedAttributes.forEach(
            atr => {
                this.setAttributeBased(atr.id)
            }
        )
        
        for (const att of ["str", "dex", "con", "int", "wis", "cha",]) {
            this.setAttribute(att)
        }

    }

    static setAttribute(name) {
        const attributeScoreField = document.querySelector(`#${name}_val`)
        attributeScoreField.textContent = myPC[name].getValue()
    }

    static setAttributeBased(name, value) {
        const total = (value || 0) + pcEffects.proficiencies.includes(name) ? myPC.proficiency : 0        
        const attributeField = document.querySelector(`#${name}`)
        const base = attributeField.dataset.base
        attributeField.textContent = `${myPC[base].getModString(total)}`
    }
}

function refreshCharacterData2() {

    pcEffects.refreshAccumulatedEffects()

    for (const effect in pcEffects.accumulatedEffects) {
        if (RefreshCharacter2[effect]) {
            RefreshCharacter2[effect](pcEffects.accumulatedEffects[effect])
        }
    }
}