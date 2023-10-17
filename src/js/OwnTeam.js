

export default class OwnTeam {
  constructor(arrayPositionedCharacters) {
    this.count = arrayPositionedCharacters.length;
    this.selected = {};
    Object.defineProperties(this, {
      count: { enumerable: false },
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
    }, [100, {}])[1];
  }


  *move(index, boardSize) {
    const arrayIndexes = [];
    let selectedCharI, selectedCharJ;
    let newPlaceI, newPlaceJ;
    for (let i = 0; i < boardSize; i += 1) {
      arrayIndexes[i] = [];
      for (let j = 0; j < boardSize; j += 1) {
        arrayIndexes[i][j] = j + i * boardSize;
        if (arrayIndexes[i][j] === this.selected.index) {
          selectedCharI = i;
          selectedCharJ = j;
        }
        if (arrayIndexes[i][j] === index) {
          newPlaceI = i;
          newPlaceJ = j;
        }
      }
      const horizontalIncrease = newPlaceJ - selectedCharJ;
      const verticalIncrease = newPlaceI - selectedCharI;
      const countStep = Math.max(Math.abs(horizontalIncrease), Math.abs(verticalIncrease));
      for (let i = 0; i < countStep; i += 1) {
        this.selected.teamMember.position = arrayIndexes[selectedCharI += verticalIncrease / countStep][selectedCharJ += horizontalIncrease / countStep];
        yield this.getPositionedCharacters();
      }
    }
  }
}