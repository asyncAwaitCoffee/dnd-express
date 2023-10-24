    const form = document.getElementById(`form-feature-add`)
    form.addEventListener("submit", async (event) =>{
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(form).entries())
        const characterID = new URLSearchParams(window.location.search).get("character_id")

        await fetch(`/account/custom-feature-add?character_id=${characterID}`, {
            method: `POST`,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(custom_feature_id => appendFeatureElement(formData, custom_feature_id.feature_id))
        .catch(error => console.error(error))

        toggleFeatureForm()
    })

    function appendFeatureElement(data, custom_feature_id) {
        const parent = document.getElementById("custom-features")
        const container = document.createElement("div")
        container.id = `cust_feat_id_${custom_feature_id}`
        container.classList.add("text-block-100")

        const details = document.createElement("details")
        const summary = document.createElement("summary")        
        summary.innerText = `${data.title} (${data.counter})`

        const description = document.createElement("div")
        description.innerText = data.description

        const delButton = document.createElement("div")
        delButton.innerText = "Delete"
        delButton.classList.add("dangerous", "detail-button")
        delButton.setAttribute("onclick", `deleteCustomFeature(event, '${custom_feature_id}')`)

        summary.appendChild(delButton)
        details.append(summary, description)
        container.append(details)
        parent.appendChild(container)
    }

    function toggleFeatureForm() {
        const featureForm = document.getElementById(`form-feature-add`)
        featureForm.classList.toggle(`absent`)
        featureForm.reset()
    }

    async function deleteCustomFeature(event, feature_id) {    //TODO: сделать не по татйтлу, а по айди
        const character_id = new URLSearchParams(window.location.search).get("character_id")

        await fetch(`/account/character/delete-custom-feature?character_id=${character_id}&feature_id=${feature_id}`)
        .then(
            response =>
                {
                    const el_cust_feat = document.querySelector(`#cust_feat_id_${feature_id}`)
                    el_cust_feat.parentNode.removeChild(el_cust_feat)
                })
    }

    function activateFeature(event) {
        event.preventDefault()
        const characterID = new URLSearchParams(window.location.search).get("character_id")
        const targetID = 1 //TODO
        const featureID = event.target.dataset.feature
        fetch(`/account/character/activate-feature?character_id=${characterID}&target_id=${targetID}&feature_id=${featureID}`)
            .then(response => response.json())
            .then(feature => {

                const { feature_id, charges_actual } = feature

                updateFeatureCharges(Object.fromEntries([[feature_id, charges_actual]]))

                pcEffects.addEffect(feature)
                drawEffect(feature)
            })
            .catch(error => console.error(error))
    }

    function updateFeatureCharges(features) {
        for (const [feature_id, charges_actual] of Object.entries(features)) {
            const el_class_feature = document.querySelector(`#class_feat_id_${feature_id} span`)
            if (el_class_feature) {
                el_class_feature.textContent = charges_actual
            }
        }  
    }