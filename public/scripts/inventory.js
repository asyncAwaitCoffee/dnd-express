    class Inventory {

        static equipItem(event, cellID) {

            const characterID = new URLSearchParams(window.location.search).get("character_id")

            fetch(`/account/inventory/equip?character_id=${characterID}&cell_id=${cellID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }            
            })
            .then(response => response.json())
            .then(equipmentEffects => {
                pcEffects.addEffect(equipmentEffects)
                updateItemUI(event.target.parentNode)
            })
            .catch(error => console.error(error))
        }

        static unequipItem(event, cellID) {

            const characterID = new URLSearchParams(window.location.search).get("character_id")

            fetch(`/account/inventory/unequip?character_id=${characterID}&cell_id=${cellID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }            
            })
            .then(response => response.json())
            .then(effect_id => {
                if (effect_id) {
                    pcEffects.removeEffects([effect_id])
                }     
            })
            .finally(() => updateItemUI(event.target.parentNode))
        }

        static deleteItem(event, cellID) {

            const characterID = new URLSearchParams(window.location.search).get("character_id")

            fetch(`/account/inventory/delete?character_id=${characterID}&cell_id=${cellID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }            
            })
            .then(response => response.json())
            .then(effect_ids => {
                if (effect_ids.length) {
                    pcEffects.removeEffects(effect_ids)
                }
                deleteItemUI(event.target)
            })
            .catch(error => console.log(error))
        }

        static useItem(event, cellID) {

            const characterID = new URLSearchParams(window.location.search).get("character_id")

            fetch(`/account/inventory/use?character_id=${characterID}&cell_id=${cellID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }            
            })
            .then(response => response.json())
            .then(item => {

                if (item.effect_id) {                
                    pcEffects.addEffect(item)
                    drawEffect(item)
                }

                if (item.is_deleted) {
                    deleteItemUI(event.target)
                    return
                }
                updateItemAmount(event.target)
            })
            .catch(error => console.error(error))
        }

        static spendItem(event, cellID) {

            const amount = Number(prompt("Количество:"))
            if (!amount) {
                return
            }
            const characterID = new URLSearchParams(window.location.search).get("character_id")

            fetch(`/account/inventory/spend?character_id=${characterID}&cell_id=${cellID}&amount=${amount}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" } // ??
            })
            .then(value => value.json())
            .then(data => {
                if (data.is_deleted) {
                    deleteItemUI(event.target)
                    return
                }
                updateItemAmount(event.target, amount)
            })
            .catch(error => console.error(error))
        }
    }