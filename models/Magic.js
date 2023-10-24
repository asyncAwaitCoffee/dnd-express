import { DB } from "./DB.js"
import { FeatureFormulas } from "./Features.js"
import { MagicException } from "./Wrappers.js"

export class Magic {

    static async addMagicEffects(effect_id, target_id, effects_actual, source, duration, is_stackable) {
        try {            
            effects_actual = Object.keys(effects_actual).length > 0 ? JSON.stringify(effects_actual) : null

            const result = await DB.queryRow(
                "call add_character_effects($1, $2, $3, $4, $5, $6, null)",
                    target_id,
                    effect_id,
                    effects_actual,
                    source,
                    duration,
                    is_stackable
            )

            return result
            
        } catch(error) {
            throw new MagicException(error.message, `addMagicEffect(${effect_id}, ${target_id})`)            
        }
    }

    //TODO: при обновлении эффекта помимо восстановления duration_left обновлять значение flat
    static async processMagicEffects(effect_id, buff, caster_id, target_id, source) {

        if (!buff || !target_id || !effect_id) {
            return null
        }
        const delayedFn = []
        const base_effects_actual = {}
        try {
            for (const [key, value] of Object.entries(buff.base_effects)) {
                value.flat = (value.flat || 0) + this.#throwDices(value.dices) + await this.#callFormula(value.formula, caster_id, target_id)

                if (DelayedApply[key]) {
                    delayedFn.push(() => (DelayedApply[key].bind(this, value.flat, target_id)))
                    continue
                }
  
                base_effects_actual[key] = value.flat
            }

            let {_result: effectsToSet} = await this.addMagicEffects(effect_id, target_id, base_effects_actual, source, buff.duration, buff.is_stackable)

            const appliedAfter = await Promise.all(delayedFn.map(f => f()()))

            buff.base_effects = base_effects_actual

            for (const appliedEffect of appliedAfter) {
                Object.assign(effectsToSet, appliedEffect)
            }

            if (Object.keys(effectsToSet).length > 0) {
                buff.effects_set = effectsToSet
            }

            return buff
            
        } catch(error) {
            throw new MagicException(error.message, `processMagicEffects(${buff}, ${target_id})`)
        }
    }

    static async getCharacterEffects(character_id) {
        const characterEffects = await DB.queryRows(
            "select * from get_character_effects($1)",
                character_id
            )
        
        return characterEffects
    }

    static #throwDices(dices) {
        let result = 0
        if (!dices) {
            return result
        }
        for (const kind in dices) {
            for (let i = 0; i < dices[kind]; i++) {
                result += Math.ceil(Math.random() * kind)
           }
       }
       return result
    }

    static async #callFormula(formula, caster, target) {
        if (!formula) {
            return 0
        }            
        return await FeatureFormulas[formula](caster)
    }

    static async getCharacterSpells(caster_id) {
        try {
            const spellList = await DB.queryRows(
                "select * from get_character_spells($1)",
                    caster_id
            )

            return spellList

        } catch(error) {
            throw new MagicException(error.message, `getCharacterSpells(${caster_id})`)            
        }
    }

    static async castSpell(caster_id, target_id, spell_id) {
        try {
            //TODO: искать сразу нужное ??
            const spellList = await this.getCharacterSpells(caster_id)

            const spellEffects = spellList.filter(s => s.effect_id == spell_id)

            const {_slot_count: slots_left} = await this.processSpellCost(spellEffects[0], caster_id) // цена для

            let castedSpell

            if (slots_left != null) {
                castedSpell = await this.processMagicEffects(spell_id, spellEffects[0], caster_id, caster_id, 'magic') //TODO: target
            }

            return {...castedSpell, spell_slots: Object.fromEntries([[spellEffects[0].spell_level, slots_left]])}

        } catch(error) {
            throw new MagicException(error.message, `castSpell(${caster_id}, ${target_id}, ${spell_id})`)            
        }
    }

    static async processSpellCost(spell, caster_id) {

        const slotCount = await DB.queryRow(
            "call pay_spell_cost($1, $2, $3, null)",
            caster_id,
            spell.spell_level,
            spell.additional_cost
        )

        return slotCount
    }
}

class DelayedApply {
    static async current_hp(amount, target_id) {
        try {
            let totalAmount = amount || 0

            const current_hp = await DB.queryRow(
                "call restore_hp($1, $2, null)",
                    target_id,
                    totalAmount
                )
            return current_hp
        } catch(error) {
            throw new MagicException(error.message, `current_hp(${amount}, ${target_id})`)
        }
    }

    static async current_mp(amount, target_id) {
        try {
            let totalAmount = amount || 0

            const spell_slots_actual = await DB.queryRow(
                "call restore_mp($1, $2, null)",
                    target_id,
                    totalAmount
                )
            return spell_slots_actual

        } catch(error) {
            throw new MagicException(error.message, `current_mp(${amount}, ${target_id})`)
        }
    }
}