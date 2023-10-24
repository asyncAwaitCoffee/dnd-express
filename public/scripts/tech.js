const els = [...document.getElementsByClassName("list-wrapper")]
for (let i = 0; i < els.length; i++) {
    els[i].style.order = i
}

const forward = document.getElementById("forward")
const back = document.getElementById("back")
const round = document.getElementById("next_round")

forward.addEventListener("click", onForward)
back.addEventListener("click", onBack)
round.addEventListener("click", onNextRound)

if (!localStorage.pcListOrder) {
    localStorage.pcListOrder = JSON.stringify([0, 1, 2, 3, 4])
} else {
    const pcListOrder = JSON.parse(localStorage.pcListOrder)
    for (let i = 0; i < els.length; i++) {
        els[i].style.order = pcListOrder[i]
    }
}

function onForward(event) {
    if (event.cancelable) {
        event.preventDefault()
    }
    const newOrder = []
    for (let i = 0; i < els.length; i++) {
        let order = Number(els[i].style.order) - 1
        if (order < 0) {
            order = els.length - 1
        }
        els[i].style.order = order
        newOrder.push(order)
    }
    localStorage.pcListOrder = JSON.stringify(newOrder)
}

function onBack(event) {
    if (event.cancelable) {
        event.preventDefault()
    }
    const newOrder = []
    for (let i = 0; i < els.length; i++) {
        let order = Number(els[i].style.order) + 1
        if (order > 4) {
            order = 0
        }
        els[i].style.order = order
        newOrder.push(order)
    }
    localStorage.pcListOrder = JSON.stringify(newOrder)
}

function onNextRound(event) {

    const characterID = new URLSearchParams(window.location.search).get("character_id")

    fetch(`/account/game/next-round?character_id=${characterID}`)
        .then(response => response.json())
        .then(result => {
            [...document.querySelectorAll(".effect-duration")].forEach(el => {
                el.textContent = (Number(el.textContent) - 1) || el.textContent //TODO ??
            })

            pcEffects.addEffect({base_effects: result.applied})
            
            if (result.deleted_effects) {
                pcEffects.removeEffects(result.deleted_effects)
            }
        })
}

document.addEventListener("wheel", throttleWheel(scrollLists, 100))

function scrollLists(event) {
    if (event.deltaY > 0) {
        onNext(event)
    } else {
        onPrev(event)
    }
}

function throttleWheel(fn, delay) {
    let step = 0;
    return (event) => {
        if (!event.altKey) {
            return
        }
        if (step > delay) {
            fn(event)
            step = 0
        } else {
            step += Math.abs(event.deltaY)
        }
    }
}