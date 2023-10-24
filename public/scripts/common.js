function drawEffect(effect) {
    if (!effect.duration) {
        return
    }
    const alreadyExists = document.querySelector(`#effect_id_${effect.effect_id}`)
    if (alreadyExists) {
        alreadyExists.parentNode.removeChild(alreadyExists)
    }
    const enchantments = document.querySelector("#enchantments")
    const newEffect = document.createElement("div")
    newEffect.classList.add("effect-icon", "effect-activated")
    newEffect.id = `effect_id_${effect.effect_id}`
    newEffect.title = `${effect.title}`
    newEffect.style=`background-image: url(images/effect_${effect.image_path || 'default'}.png); background-size: cover;`

    const duration = document.createElement("div")
    duration.classList.add("effect-duration")
    duration.style="color: white;"
    duration.textContent = effect.duration || "∞"

    newEffect.appendChild(duration)

    enchantments.appendChild(newEffect)
}