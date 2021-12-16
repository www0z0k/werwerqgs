class Hero {
    constructor(seedPoints, minStat, diceVal, kHP, kMana, id) {
        this.checkDice = diceVal; // do we randomize this one?
        this.id = id;

        let seed = seedPoints - minStat * 3;
        const asWritten = false;
        this.vitality = dice(seed);
        seed = seed + (asWritten ? 0 : minStat) - this.vitality;
        this.strength = dice(seed);
        seed = seed + (asWritten ? 0 : minStat) - this.strength;
        this.agility = dice(seed);
        seed = seed + (asWritten ? minStat * 3 : minStat) - this.agility;
        this.intelligence = seed;
        
        this.class = this.vitality >= Math.max(this.strength, this.agility, this.intelligence) ? 'TANK'
        : (this.strength >= Math.max(this.agility, this.intelligence) ? 'FIGHTER'
        : (this.agility >= this.intelligence ? 'ARCHER' : 'PRIEST'))
        
        this.fullHP = Math.floor(this.vitality * kHP[this.class.toLowerCase()]);
        this.hp = this.fullHP;
        this.fullMana = Math.floor(this.intelligence * kMana[this.class.toLowerCase()]);
        this.mana = this.fullMana;
        
        this.kMana = kMana;
        this.kHP = kHP;

        // statistics
        this.hitsTaken = 0;
        this.hitsGiven = 0;
        this.damageDealt = 0;
        this.damageTaken = 0;
        this.frags = 0;
        this.healingDealt = 0;
    }
    /** negative is damage to enemy */
    rollStatAgainst(stat, value) {
        let roll = dice(this.checkDice);
        switch(stat) {
            case 'vitality': 
                roll += this.vitality;
                break;
            case 'strength': 
                roll += this.strength;
                break;
            case 'agility': 
                roll += this.agility;
                break;
            case 'intelligence': 
                roll += this.intelligence;
                break;
            default: alert(`Error: no ${stat} here`);
        }
        const result = value - roll;
        if (result > 0) {
            this.takeDamage(result);
            ++this.hitsTaken;
            this.damageTaken += result;
        } else if(result != 0) {
            this.damageDealt += Math.abs(result);
            ++this.hitsGiven;
        }
        return result;
    }

    takeDamage(amount) {
        this.hp = this.hp < amount ? 0 : this.hp - amount;
    }
    
    recieveHealing(amount) {
        this.hp = this.hp + amount > this.fullHP ? this.fullHP : this.hp + amount;
    }
    
    isAlive() { return this.hp > 0 }

    toTSVHeader() {
        return `CLASS\tVIT\tSTR\tAGI\tINT\tHP\tMANA\tDICE`;
    }
    toTSVString() {
        return `${this.class}\t${this.vitality}\t${this.strength}\t${this.agility}\t${this.intelligence}\t${this.fullHP}\t${this.fullMana}\t${this.checkDice}`;
    }

    toCSVHeaderState() {
        return `ID, CLASS, VIT, STR, AGI, INT, CURR HP, HP, CURR MANA, MANA, DICE, hits taken, dmg taken, hits given, dmg dealt, frags, healing dealt`;
    }
    
    toCSVStringState() {
        return `${this.id}, ${this.class}, ${this.vitality}, ${this.strength}, ${this.agility}, ${this.intelligence}, ${this.hp}, ${this.fullHP}, ${this.mana}, ${this.fullMana}, ${this.checkDice}, ${this.hitsTaken}, ${this.damageTaken}, ${this.hitsGiven}, ${this.damageDealt}, ${this.frags}, ${this.healingDealt}`;
    }
    
    toString(delim = '<br>') {
        return `${this.class}${delim}VIT: ${this.vitality}${delim}STR: ${this.strength}${delim}AGI: ${this.agility}${delim}INT: ${this.intelligence}${delim}HP: ${this.hp}/${this.fullHP}${delim}MANA: ${this.mana}/${this.fullMana}\tDICE: ${this.checkDice}`;
    }

    healthStats() {
        return `${this.hp}/${this.fullHP}`;
    }
    manaStats() {
        return `${this.mana}/${this.fullMana}`;
    }
    healSelf() {
        if(this.mana > 0) {
            if(this.hp < this.fullHP){
                const deltaHP = this.fullHP - this.hp;
                if(this.mana >= deltaHP){
                    this.hp = this.fullHP;
                    this.mana -= deltaHP;
                    this.healingDealt += deltaHP;
                } else {
                    this.hp += this.mana;
                    this.healingDealt += this.mana;
                    this.mana = 0;
                }
            }
        }
    }
}