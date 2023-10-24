function abilityMod(n) {
    if (isNaN(Number(n))) {
        return -100;
    }
    const mod = Math.floor(n/2) - 5
    return mod
}

function calcProficiency(level) {
    return Math.ceil(level / 4) + 1
}