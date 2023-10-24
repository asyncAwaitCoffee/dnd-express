    const rest = document.getElementById("rest") 
    rest.addEventListener("click", onRest)

    function onRest(event) {

        const characterID = new URLSearchParams(window.location.search).get("character_id")

        fetch(`/account/character/rest?character_id=${characterID}`)
            .then(response => response.json())
            .then(data => {
                const { current_hp, max_hp, spell_slots_actual, deleted_effects, charges_restored } = data

                pcEffects.addEffect({base_effects: {current_hp, max_hp, spell_slots_actual}})

                if (deleted_effects) {
                    pcEffects.removeEffects(deleted_effects)
                }

                updateFeatureCharges(charges_restored)             
            })
    }

    function promptChangeHP() {
        amount = Number(prompt("Введите число:"))
        if (!amount) {
            console.error("Неверно!", amount)
            return
        }

        const characterID = new URLSearchParams(window.location.search).get("character_id")

        fetch(`/account/character/restore-hp?character_id=${characterID}&flat=${amount}`)
        .then(response => response.json())
        .then(effect => {
            pcEffects.addEffect(effect)
        })
        .catch(error => console.error(`promptChangeHP(${amount})`,error))
    }