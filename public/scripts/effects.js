class Effects {
    constructor(equipmentEffects, characterEffects) {
        this.equipmentEffects = equipmentEffects
        this.characterEffects = {}
        this.proficiencies = myPC.proficiencies.map(p => p.code)
        this.accumulatedEffects = {
            armor_class: {flat: 0},
            current_hp: {flat: myPC.currentHP},
            max_hp: {flat: myPC.maxHP},
            temp_hp: {flat: myPC.tempHP},
            initiative: {flat: myPC.dex.getMod()},
            speed: {flat: myPC.speed},
            proficiency: {flat: myPC.proficiency}
        }

        for (const charEffect of characterEffects) {
            this.characterEffects[charEffect.effect_id] = charEffect
        }

        for (const equipEffect of equipmentEffects) {
            this.characterEffects[equipEffect.effect_id] = equipEffect
        }
    }

    addEffect(effect) {
        if (effect.effect_id) {
            this.removeEffects([effect.effect_id])
            this.characterEffects[effect.effect_id] = effect
        }
        const {base_effects, mark_effects, asis_effects, effects_set} = effect
        if (base_effects) {
            for (const [effect, power] of Object.entries(base_effects)) {                                
                if (!this.accumulatedEffects[effect] || this.#skip(effect)) {
                    this.accumulatedEffects[effect] = {flat: power}
                } else {
                    this.accumulatedEffects[effect].flat = (this.accumulatedEffects[effect].flat || 0) + power                
                }

                RefreshCharacter2[effect](this.accumulatedEffects[effect])
            }
        }
        
        if (mark_effects) {
            for (const mark in mark_effects) {
                mark_effects[mark].forEach(e => {
                    document.querySelector(`#${e}`)?.classList.add(mark)
                })
            }
        }
        
        if (asis_effects) {
            for (const [effect, data] of Object.entries(asis_effects)) {
                if (data.flat) {
                    if (this.accumulatedEffects[effect]) {
                        this.accumulatedEffects[effect].flat = (this.accumulatedEffects[effect].flat || 0) + data.flat
                    } else {
                        this.accumulatedEffects[effect] = {flat: data.flat}
                    }                        
                }

                if (data.dices) {
                    if (this.accumulatedEffects[effect]) {
                        for (const [dice, qty] of Object.entries(data.dices)) {
                            if (dice in (this.accumulatedEffects[effect].dices || {})) {
                                this.accumulatedEffects[effect].dices[dice] += qty
                            } else {
                                this.accumulatedEffects[effect].dices = Object.assign(this.accumulatedEffects[effect].dices || {}, Object.fromEntries([[dice, qty]]))
                            }
                        }
                    } else {
                        this.accumulatedEffects[effect] = {dices: data.dices}
                    }
                }

                RefreshCharacter2[effect](this.accumulatedEffects[effect])
            }            
        }

        if (effects_set) {                
            for (const [effect, power] of Object.entries(effects_set)) {
                this.accumulatedEffects[effect] = {flat: power}
                RefreshCharacter2[effect](this.accumulatedEffects[effect])
            }
        }
    }
//принимает массив из удалённых effect_id
    removeEffects(effects) {
        for (const effect_id of effects) {

            if (!this.characterEffects[effect_id]) {
                return
            }
            
            const effectIcon = document.querySelector(`#effect_id_${effect_id}`)
            if (effectIcon) {
                effectIcon.classList.add("effect-deactivated")
                setTimeout(() => {
                    effectIcon.parentNode?.removeChild(effectIcon)
                }, 400)
            }
            
            const {base_effects, mark_effects, asis_effects} = this.characterEffects[effect_id]

            if (base_effects) {
                for (const [effect, power] of Object.entries(base_effects)) {
                    if (this.#skip(effect)) {
                        continue
                    }
                    this.accumulatedEffects[effect].flat -= power
                    RefreshCharacter2[effect](this.accumulatedEffects[effect])
                }
            }

            if (mark_effects) {
                for (const [mark, list] of Object.entries(mark_effects)) {
                    list.forEach(stat => {
                        const markedStat = document.querySelector(`#${stat}`)
                        markedStat?.classList.remove(mark)
                    })
                }
            }

            if (asis_effects) {
                for (const [effect, data] of Object.entries(asis_effects)) {
                    if (data.flat) {
                        this.accumulatedEffects[effect].flat -= data.flat
                    }

                    if (data.dices) {
                        if (this.accumulatedEffects[effect]) {
                            for (const [dice, qty] of Object.entries(data.dices)) {
                                if (dice in (this.accumulatedEffects[effect].dices || {})) {
                                    this.accumulatedEffects[effect].dices[dice] -= qty
                                }
                            }
                        }
                    }
                    
                    RefreshCharacter2[effect](this.accumulatedEffects[effect])
                }
            }

            delete this.characterEffects[effect_id]

        }
    }

    refreshAccumulatedEffects() {
        //TODO: начальное значение accumulatedEffects перенести сюда ??
            //  заменить на вызов addEffect в цикле ??
        const listOfEnchantments = {...this.characterEffects} 

        for (const [effect_id, enchantment] of Object.entries(listOfEnchantments)) {
//base_effects
            if (enchantment.base_effects) {
                for (const [effect, power] of Object.entries(enchantment.base_effects)) {
                    if (this.#skip(effect)) {
                        continue
                    }
                    if (!this.accumulatedEffects[effect]) {
                        this.accumulatedEffects[effect] = {flat: power}
                    } else {
                        this.accumulatedEffects[effect].flat = (this.accumulatedEffects[effect].flat || 0) + power
                    }
                }
            }
//mark_effects
            if (enchantment.mark_effects) {
                for (const mark in enchantment.mark_effects) {
                    enchantment.mark_effects[mark].forEach(m => {
                        const target = document.querySelector(`#${m}`)
                        if (target) {
                            target.classList.add(`${mark}`)
                        }
                    })
                }
            }
//asis_effects
            if (enchantment.asis_effects) {
                for (const [effect, data] of Object.entries(enchantment.asis_effects)) {
                    if (data.flat) {
                        if (this.accumulatedEffects[effect]) {
                            this.accumulatedEffects[effect].flat = (this.accumulatedEffects[effect].flat || 0) + data.flat
                        } else {
                            this.accumulatedEffects[effect] = {flat: data.flat}
                        }                        
                    }

                    if (data.dices) {
                        if (this.accumulatedEffects[effect]) {
                            for (const [dice, qty] of Object.entries(data.dices)) {
                                if (dice in (this.accumulatedEffects[effect].dices || {})) {
                                    this.accumulatedEffects[effect].dices += qty
                                } else {
                                    this.accumulatedEffects[effect].dices = Object.assign(this.accumulatedEffects[effect].dices || {}, Object.fromEntries([[dice, qty]]))
                                }
                            }
                        } else {
                            this.accumulatedEffects[effect] = {dices: data.dices}
                        }
                    }
                }
            }

            if (enchantment.effects_set) {                
                for (const [effect, power] of Object.entries(enchantment.effects_set)) {
                    this.accumulatedEffects[effect] = {flat: power}
                }
            }
        }            
    }

    #skip(effect) {
        return ["max_hp", "current_hp", "spell_slots_actual"].includes(effect)
    }
}