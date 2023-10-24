    const inventoryItems = [...document.getElementsByClassName("inventory-item")]

    inventoryItems.forEach(i => i.addEventListener("contextmenu", openItemMenu))
    //TODO: превентить contextmenu нужно и на пустых клетках
    function openItemMenu(event) {
        event.preventDefault()
        if (!event.target.classList.contains("inventory-item")) {
            return
        }
        event.stopPropagation()
        
        closeOpenedMenu()

        const itemMenu = event.target.querySelector("#inventory-item-menu")

        itemMenu.classList.toggle("absent")
        itemMenu.classList.toggle("opened")
    }

    function closeOpenedMenu() {
        const openedMenu = document.getElementsByClassName("opened")[0]
        if (openedMenu) {
            openedMenu.classList.add("absent")
            openedMenu.classList.remove("opened")
        }
    }

    function getItemInformation(event) {
        console.log(event.target.parentNode.parentNode.querySelector("#item-description").innerText.trim())
    }

    function updateItemUI(menu) {

        const menuOptions = [...menu.querySelectorAll(".menu-option")]
        menuOptions.forEach(option => option.classList.toggle("absent"))

        const itemCell = menu.parentNode
        itemCell.classList.toggle("equiped")
    }

    function deleteItemUI(target) {
        const itemCell = target.parentNode.parentNode
        const inventoryCell = itemCell.parentNode

        inventoryCell.removeChild(itemCell)

        inventoryCell.classList.add(target.dataset.value)
        setTimeout(()=> inventoryCell.classList.remove(target.dataset.value), 200)
    }

    function updateItemAmount(target, amount = 1) {
        const itemCounter = target.parentNode.parentNode.querySelector(".item-quantity")
        itemCounter.textContent = Number(itemCounter.textContent) - amount

        target.parentNode.parentNode.classList.add(target.dataset.value)
        setTimeout(()=> target.parentNode.parentNode.classList.remove(target.dataset.value), 200)

    }

    document.addEventListener("click", event => closeOpenedMenu())