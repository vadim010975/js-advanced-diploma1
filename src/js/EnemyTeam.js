

export default class EnemyTeam {
    constructor(arrayPositionedCharacters) {
      this.count = arrayPositionedCharacters.length;
      Object.defineProperty(this, 'count', {enumerable: false});
      for (let i = 0; i < arrayPositionedCharacters.length; i += 1) {
        this[`teamMember${i + 1}`] = {
          character: arrayPositionedCharacters[i].character,
          position: arrayPositionedCharacters[i].position,
        };
        this[`teamMember${i + 1}`].character.id += 10;
      }
    }
  
    getPositionedCharacters() {
      const arrayPositionedCharacters = [];
      for (let key in this) {
        arrayPositionedCharacters.push({
          character: this[key].character,
          position: this[key].position,
        });
      }
      return arrayPositionedCharacters;
    }

    setDamage(charId, attack) {
      const damage = Math.max(attack - this[`teamMember${charId}`].character.defence, attack * 0.1);
      this[`teamMember${charId}`].character.health -= damage;
    }

    getAttecker() {

    }


    
  }