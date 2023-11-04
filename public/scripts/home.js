const cards = document.querySelectorAll(".cards")

cards.forEach(
    (card, i) => {
        card.addEventListener("mouseover",
            event => {
                const leaves = document.querySelectorAll(`.${card.dataset.leaves}`)
                leaves.forEach(
                    leave => leave.classList.add("spark")
                )
            }
        )
        card.addEventListener("mouseout",
            event => {
                const leaves = document.querySelectorAll(".spark")
                leaves.forEach(leave => leave.classList.remove("spark"))
            }
        )
        //card.style.transform = `rotate(${i * 72}deg) translate(50%, 50%) rotate(-${i * 72}deg)`
    }
)