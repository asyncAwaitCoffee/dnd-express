    function castSpell(event) {
        event.preventDefault()
        const characterID = new URLSearchParams(window.location.search).get("character_id")
        const targetID = 1 //TODO
        const spellID = event.target.dataset.spell
        fetch(`/account/character/cast-spell?character_id=${characterID}&target_id=${targetID}&spell_id=${spellID}`)
        .then(response => response.json())
        .then(spell => {
            for (const [spell_level, slots_qty] of Object.entries(spell.spell_slots)) {
                document.querySelector(`#spell_slot_${spell_level}`).textContent = slots_qty || 0
            }
            
            if (spell.effect_id) {                
                pcEffects.addEffect(spell)
                drawEffect(spell)
            }
        })
        .catch(error => console.log(error))
    }