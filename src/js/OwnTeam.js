import gamePlay from './app.js'

export default class OwnTeam {
  constructor(arrayPositionedCharacters) {
    this.count = arrayPositionedCharacters.length;
    this.selected = null;
    Object.defineProperties(this, {
      count: { enumerable: false },
      selected: { enumerable: false },
  });
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

  setSelectedTeamMember(index) {
    for (let key in this) {
      if (gamePlay.cells[index].querySelector('.character').dataset.id === this[key].id) {
        this.selected = this[key];
      }
    }
  }
}