export class DBException extends Error {
    constructor(message, context) {
        super(`Context: ${context}\nMessage: ${message}`)
        this.name = "DBException"
    }
}

export class PCException extends Error {
    constructor(message, context) {
        super(`Context: ${context}\nMessage: ${message}`)
        this.name = "PCException"
    }
}

export class InventoryException extends Error {
    constructor(message, context) {
        super(`Context: ${context}\nMessage: ${message}`)
        this.name = "InventoryException"
    }
}
export class UserException extends Error {
    constructor(message, context, hint) {
        super(`Context: ${context}\nMessage: ${message}`)
        this.name = "UserException"
        this.hint = hint
    }
}

export class MagicException extends Error {
    constructor(message, context) {
        super(`Context: ${context}\nMessage: ${message}`)
        this.name = "MagicException"
    }
}

export class FeatureException extends Error {
    constructor(message, context) {
        super(`Context: ${context}\nMessage: ${message}`)
        this.name = "FeatureException"
    }
}

export class GameException extends Error {
    constructor(message, context) {
        super(`Context: ${context}\nMessage: ${message}`)
        this.name = "GameException"
    }
}