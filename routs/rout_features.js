import { Features } from "../models/Features.js"

export async function activateClassFeature (request, response) {
    try {
        const character_id = request.query.character_id
        const feature_id = request.query.feature_id

        const result = await Features.activateClassFeature(character_id, character_id, feature_id) //TODO: target
        if (result) {
            response.send(result)
        } else {
            response.status(200).send()
        }
        
        
    } catch(error) {
        console.log(error)
        response.status(400).send()
    }
}

export async function addCustomFeature_POST(request, response) {
    try {
        const character_id = request.query.character_id
        const custom_feature_id = await Features.addCustomFeature(character_id, request.body)

        response.send(custom_feature_id)
        
    } catch(error) {
        console.log(error)
        response.status(400).send()
    }
}

export async function deleteCustomFeature_GET(request, response) {
    try {
        await Features.deleteCustomFeature(request.query.character_id, request.query.feature_id)
        response.status(200).send()
    } catch(error) {
        console.log(error)
        response.status(400).send()
    }
}