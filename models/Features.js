import { DB } from "./DB.js";
import { Magic } from "./Magic.js";
import { PC } from "./PC.js";
import { FeatureException } from "./Wrappers.js";

export class Features {

    static async activateClassFeature(caster_id, target_id, feature_id) {
        try {
            const feature = await DB.queryRow(
                'select * from get_character_class_feature($1, $2)',
                    caster_id,
                    feature_id
            )

            const { charges_actual } = await this.processFeatureCost(caster_id, feature_id)

            if (charges_actual == null) {
                return
            }
                   
            const processedEffects = await Magic.processMagicEffects(feature.effect_id, feature, caster_id, target_id, 'feature')
            Object.assign(processedEffects, {charges_actual})
            
            return processedEffects

        } catch(error) {
            console.log(error)
            throw new FeatureException(error.message, `activateClassFeature(${caster_id}, ${target_id}, ${feature_id})`)
        }
    }

    static async processFeatureCost(caster_id, feature_id) {

        const chargesLeft = await DB.queryRow(
            "call pay_feature_cost($1, $2, null)",
            caster_id,
            feature_id
        )

        return chargesLeft
    }
    
    static async getCustomFeatures(character_id) {
        try {
            const features = await DB.queryRows(
                "select * from get_character_custom_features($1)",
                    character_id
                )
            return features
        } catch(error) {
            throw new FeatureException(error.message, `getCustomFeatures(${character_id})`)
        }
    }

    static async addCustomFeature(character_id, data) {
        try {
            const custom_feature_id = await DB.queryRow(
                "call add_character_custom_feature($1, $2, $3, $4, $5, $6, null)",
                    character_id,
                    data.title,
                    data.description,
                    null,
                    null,
                    data.counter || 0   // 0 if null
                )
            return custom_feature_id
        } catch(error) {
            throw new FeatureException(error.message, `addCustomFeature(${character_id}, ${data})`)
        }
    }

    static async deleteCustomFeature(character_id, feature_id) {     
        try {   
            await DB.queryRow(
                "call delete_character_custom_feature($1, $2)",
                    character_id,
                    feature_id
                )
        } catch(error) {
            throw new FeatureException(error.message, `deleteCustomFeature(${character_id}, ${feature_id})`)
        }
    }
}

export class FeatureFormulas {
    static async rageCharges(character_id) {
        const { _main_level } = await PC.getCharacterStats(character_id)

        if (_main_level > 16) return 6
		if (_main_level > 11) return 5
		if (_main_level > 5) return 4
		if (_main_level > 2) return 3
		return 2
    }
    static async rageDamage(character_id) {
        const { _main_level } = await PC.getCharacterStats(character_id)

        if (_main_level > 15) return 4
		if (_main_level > 8) return 3
		return 2
    }
}