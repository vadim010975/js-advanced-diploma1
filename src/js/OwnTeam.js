import Indexes from './Indexes.js';

export default class OwnTeam {
  constructor(arrayPositionedCharacters) {
    this.selected = {};
    Object.defineProperties(this, {
      selected: { enumerable: false },
  });
    for (let i = 0; i < arrayPositionedCharacters.length; i += 1) {
      this[`teamMember${i + 1}`] = {
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

  setSelectedTeamMember(cell, index) {
    for (let key in this) {
      if (+cell.querySelector('.character').dataset.id === +this[key].character.id) {
        this.selected.teamMember = this[key];
        this.selected.index = index;
      }
    }
  }

  getTarget() {
    return this.getPositionedCharacters().reduce((acc, item) => {
      if (item.character.health < acc[0]) {
        return [item.character.health, item.character.id];
      }
      return acc;
    }, [101, {}])[1];
  }

  setDamage(charId, attack) {
    const damage = Math.max(attack - this[`teamMember${charId}`].character.defence, attack * 0.1);
    this[`teamMember${charId}`].character.health -= damage;
    if (this[`teamMember${charId}`].character.health <= 0) {
      delete this[`teamMember${charId}`];
    }
  }


  *move(index, boardSize) {
    const indexes = new Indexes(boardSize);
    const arrayIndexes = indexes.arrayIndexes;
    let [selectedCharI, selectedCharJ] = indexes.getIndexes(this.selected.index);
    const [newPlaceI, newPlaceJ] = indexes.getIndexes(index);
    //for (let i = 0; i < boardSize; i += 1) {
      const horizontalIncrease = newPlaceJ - selectedCharJ;
      const verticalIncrease = newPlaceI - selectedCharI;
      const countStep = Math.max(Math.abs(horizontalIncrease), Math.abs(verticalIncrease));
      for (let i = 0; i < countStep; i += 1) {
        this.selected.teamMember.position = arrayIndexes[selectedCharI += verticalIncrease / countStep][selectedCharJ += horizontalIncrease / countStep];
        yield this.getPositionedCharacters();
      }
    //}
  }
}