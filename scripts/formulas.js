import { PCException } from "../models/Wrappers.js"

export function abilityMod(n) {
    if (isNaN(Number(n))) {
        throw new PCException(`Значение ${n} не является числом.`, `abilityMod(${n})`)
    }
    const mod = Math.floor(n/2) - 5
    return mod
    //return mod >= 0 ? `+${mod}` : `${mod}`
}