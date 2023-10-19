import Indexes from './Indexes.js';
import Cell from './Cell.js'

export default class EnemyTeam {
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
    const damage = Math.max(attack - this[`teamMember${charId - 10}`].character.defence, attack * 0.1);
    this[`teamMember${charId - 10}`].character.health -= damage;
    if (this[`teamMember${charId - 10}`].character.health <= 0) {
      console.log(delete this[`teamMember${charId - 10}`]);
    }
    console.log(this.getPositionedCharacters());
  }

  setSelectedTeamMember(cell, index) {
    for (let key in this) {
      if (+cell.querySelector('.character').dataset.id === +this[key].character.id) {
        this.selected.teamMember = this[key];
        this.selected.index = index;
      }
    }
  }

  setNewpositionSelectedTeamMember(cell, index) {
    this.selected.cell = cell;
    this.selected.index = index;
  }

  getAtteckerId() {
    const daemons = this.getPositionedCharacters().filter(el => el.character.type === 'daemon');
    const vampires = this.getPositionedCharacters().filter(el => el.character.type === 'vampire');
    const undeads = this.getPositionedCharacters().filter(el => el.character.type === 'undead');
    let characters;
    if (daemons.length === 0 && vampires.length === 0) {
      characters = undeads;
    } else if (daemons.length === 0 && vampires.length !== 0) {
      characters = vampires;
    } else {
      characters = daemons;
    }
    const attackerId = characters.reduce((acc, item) => {
      if (item.character.attack > acc[0]) {
        return [item.character.attack, item.character.id];
      }
      return acc;
    }, [0, {}])[1];
    return attackerId;
  }

  *move(index, boardSize) {
    const indexes = new Indexes(boardSize);
    const arrayIndexes = indexes.arrayIndexes;
    const [targetI, targetJ] = indexes.getIndexes(index);
    let [attackerI, attackerJ] = indexes.getIndexes(this.selected.index);

    console.log('target: ', targetI, targetJ);
    console.log('attacker: ', attackerI, attackerJ);
    const horizontalDirection = Math.sign(targetJ - attackerJ);
    const verticalDirection = Math.sign(targetI - attackerI);
    console.log('horizontalDirection: ', horizontalDirection);
    console.log('verticalDirection: ', verticalDirection);
    const maxStepAttackers = new Cell(this.selected.cell).charHikeRange;
    console.log('maxstep: ', maxStepAttackers);
    //const newPlaceIndex = arrayIndexes[attackerI + maxStepAttackers * verticalDirection][attackerJ + maxStepAttackers * horizontalDirection];
    //const newPlaceI = attackerI + maxStepAttackers * verticalDirection;
    //const newPlaceJ = attackerJ + maxStepAttackers * horizontalDirection;

    // const newPlaceCell = new Cell(newPlaceIndex);
    // if (!newPlaceCell.isEmpty) {
    //   if (maxStepAttackers === 1) {

    //   }
    // }
    

    const horizontalIncrease = maxStepAttackers * horizontalDirection;
    const verticalIncrease = maxStepAttackers * verticalDirection;
    const countStep = Math.max(Math.abs(horizontalIncrease), Math.abs(verticalIncrease));
    for (let i = 0; i < countStep; i += 1) {
      const attackerNewI = attackerI + verticalIncrease / countStep;
      const attackerNewJ = attackerJ + horizontalIncrease / countStep;
      if (attackerNewI >= 0 && attackerNewI < boardSize && attackerNewJ >= 0 && attackerNewJ < boardSize) {
        attackerI = attackerNewI;
        attackerJ = attackerNewJ;
      }
      this.selected.teamMember.position = arrayIndexes[attackerI][attackerJ];
      yield this.getPositionedCharacters();
      //console.log(this.getPositionedCharacters());
    }
  }

}