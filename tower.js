class Tower {
    constructor(stat, power, dice, hp) {
        this.stat = stat;
        this.power = power;
        this.dice = dice;
        this.fullHP = hp;
        this.hp = hp;
        this.enabled = true;
    }
    toString(delim = '<br>') {
        return `${this.stat}${delim}POW: ${this.power}${delim}HP: ${this.hp}/${this.fullHP}${delim}dice: ${this.dice}`;
    }
    toCSVHeader() {
        return `STAT, POWER, HP, FULL HP, DICE`;
    }
    toCSVString() {
        return `${this.stat}, ${this.power}, ${this.hp}, ${this.fullHP}, ${this.dice}`;
    }
    roll() { return dice(this.dice) + this.power }
    isAlive() { return this.hp > 0 }
}