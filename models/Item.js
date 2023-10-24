export class Item {
    //TODO: добавить методы работы с БД
    constructor(data) {
        this.accuracy = data.atack.accuracy || 0
        this.damage = data.atack.damage || 0
        this.armorClass = data.defense.class || 0
    }
}