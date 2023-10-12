

export default class EnemyTeam {
    constructor(arrayPositionedCharacters) {
      this.count = arrayPositionedCharacters.length;
      Object.defineProperty(this, 'count', {enumerable: false});
      for (let i = 0; i < arrayPositionedCharacters.length; i += 1) {
        this[`teamMember${i}`] = {
          character: arrayPositionedCharacters[i].character,
          position: arrayPositionedCharacters[i].position,
        };
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
  }