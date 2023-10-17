// добавил
import Bowman from './characters/Bowman.js';
import Daemon from './characters/Daemon.js';
import Magician from './characters/Magician.js';
import Swordsman from './characters/Swordsman.js';
import Undead from './characters/Undead.js';
import Vampire from './characters/Vampire.js';
import GamePlay from './GamePlay.js';
import { generateTeam, playersInit } from './generators.js';
import cursors from './cursors.js';
import Cell from './Cell.js'
import OwnTeam from './OwnTeam.js';
import EnemyTeam from './EnemyTeam.js';
import mergeTeams from './mergeTeams.js';
import GameState from './GameState.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.ownTeam = new OwnTeam(playersInit([
      {
        team: generateTeam([Bowman, Swordsman, Magician], 2, 4),
        cellsArray: [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
      }
    ]));
    this.enemyTeam = new EnemyTeam(playersInit([{
      team: generateTeam([Daemon, Undead, Vampire], 2, 4),
      cellsArray: [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63],
    }
    ]));
    this.gamePlay.redrawPositions(mergeTeams(this.ownTeam.getPositionedCharacters(), this.enemyTeam.getPositionedCharacters()));
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    GameState.activePlayer = 0;
    this.play();
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  play() {
    console.log(GameState.activePlayer);
    if (GameState.activePlayer === 1) {
      this.moveEnemy();
    }
  }

  onCellClick(index) {
    if (this.gamePlay.selectedCellIdx !== null) {
      this.gamePlay.deselectCell(this.gamePlay.selectedCellIdx);
    }
    const cell = new Cell(this.gamePlay.cells[index]);
    if (cell.role === 'ally') {
      this.gamePlay.selectCell(index);
      this.gamePlay.selectedCellIdx = index;
      this.ownTeam.setSelectedTeamMember(this.gamePlay.cells[index], index);
    } else if (cell.isEmpty && this.gamePlay.cells[index].classList.contains('selected-green')) {
      this.move(index);
    } else if (cell.role === 'enemy' && this.gamePlay.cells[index].classList.contains('selected-red')) {
      this.attack(index);
    } else {
      GamePlay.showError('Здесь нет твоего персонажа');
    }
  }

  onCellEnter(index) {
    const cell = new Cell(this.gamePlay.cells[index]);
    // если клетка не пустая
    if (!cell.isEmpty) {
      // вывод информации title
      const message = this.showInformation(cell.charEl);
      this.gamePlay.showCellTooltip(message, index);
      // если свой и не selected
      if (cell.role === 'ally' && !cell.isSelected) {
        this.gamePlay.setCursor(cursors.pointer);
        // если чужой и персонаж выбран
      } else if (this.gamePlay.selectedCellIdx !== null && cell.role === 'enemy') {
        // если в зоне атаки выбранного персонажа
        if (this.getIndexesMoveAndAttack().arrayAttackIndexes.includes(index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else {
        this.gamePlay.setCursor(cursors.auto);
      }
    } else {
      // если клетка пустая
      // если персонаж selected
      if (this.gamePlay.selectedCellIdx !== null) {
        // если в зоне похода выбранного персонажа
        if (this.getIndexesMoveAndAttack().arrayMoveIndexes.includes(index)) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else {
        this.gamePlay.setCursor(cursors.auto);
      }
    }
  }

  onCellLeave(index) {
    if (this.gamePlay.cells[index].querySelector('.character')) {
      this.gamePlay.hideCellTooltip(index);
    };

    this.gamePlay.setCursor(cursors.auto);
    if (index !== this.gamePlay.selectedCellIdx) {
      this.gamePlay.deselectCell(index);
    }
  }

  showInformation(charEl) {
    return `\u{1F396}${charEl.dataset.level} \u{2694}${charEl.dataset.attack} \u{1F6E1}${charEl.dataset.defence} \u{2764}${charEl.dataset.health}`;
  }

  move(index) {
    const generator = this.ownTeam.move(index, this.gamePlay.boardSize);
    let newArrayPositionOwnTeam;
    const drawСall = () => {
      setTimeout(() => {
        newArrayPositionOwnTeam = generator.next();
        if (!newArrayPositionOwnTeam.done) {
          this.gamePlay.redrawPositions(mergeTeams(newArrayPositionOwnTeam.value, this.enemyTeam.getPositionedCharacters()));
          drawСall();
        } else {
          this.gamePlay.deselectCell(index);
        }
      }, 50);
    }
    drawСall();
    GameState.activePlayer = 1;
    this.play();
  }

  attack(index) {
    const attack = this.ownTeam.selected.teamMember.character.attack;
    this.gamePlay.showDamage(index, attack).then(() => {
      this.enemyTeam.setDamage(this.gamePlay.cells[index].querySelector('.character').dataset.id, attack);
      this.gamePlay.redrawPositions(mergeTeams(this.ownTeam.getPositionedCharacters(), this.enemyTeam.getPositionedCharacters()));
    });
    GameState.activePlayer = 1;
    this.play();
  }


  moveEnemy() {
    const targetId = this.ownTeam.getTarget();
    console.log(targetId);
    const targetEl = this.gamePlay.boardEl.querySelector(`[data-id=\"${targetId}\"]`);
    console.log(targetEl);
    const targetIdx = this.gamePlay.cells.indexOf(targetEl.closest('.cell'));
    console.log(targetIdx);

    GameState.activePlayer = 0;
    this.play();
  }



  getIndexesMoveAndAttack() {
    if (this.gamePlay.selectedCellIdx === null) {
      return;
    }
    const arrayIndexes = [];
    let indexI, indexJ;
    for (let i = 0; i < this.gamePlay.boardSize; i += 1) {
      arrayIndexes[i] = [];
      for (let j = 0; j < this.gamePlay.boardSize; j += 1) {
        arrayIndexes[i][j] = j + i * this.gamePlay.boardSize;
        if (arrayIndexes[i][j] === this.gamePlay.selectedCellIdx) {
          indexI = i;
          indexJ = j;
        }
      }
    }
    const cell = new Cell(this.gamePlay.cells[this.gamePlay.selectedCellIdx]);
    const countStep = cell.charHikeRange;
    const arrayMoveIndexes = [];
    for (let i = 1; i <= countStep; i += 1) {
      arrayMoveIndexes.push(arrayIndexes[indexI][indexJ - i]);
      arrayMoveIndexes.push(arrayIndexes[indexI][indexJ + i]);
      if (indexI - i >= 0) {
        arrayMoveIndexes.push(arrayIndexes[indexI - i][indexJ]);
        arrayMoveIndexes.push(arrayIndexes[indexI - i][indexJ - i]);
        arrayMoveIndexes.push(arrayIndexes[indexI - i][indexJ + i]);
      }
      if (indexI + i < arrayIndexes.length) {
        arrayMoveIndexes.push(arrayIndexes[indexI + i][indexJ]);
        arrayMoveIndexes.push(arrayIndexes[indexI + i][indexJ + i]);
        arrayMoveIndexes.push(arrayIndexes[indexI + i][indexJ - i]);
      }
    }
    const attackRange = cell.charAttackRange;
    const arrayAttackIndexes = [];
    const startI = indexI - attackRange < 0 ? 0 : indexI - attackRange;
    const startJ = indexJ - attackRange < 0 ? 0 : indexJ - attackRange;
    const endI = indexI + attackRange >= arrayIndexes.length ? arrayIndexes.length - 1 : indexI + attackRange;
    const endJ = indexJ + attackRange >= arrayIndexes.length ? arrayIndexes.length - 1 : indexJ + attackRange;
    for (let i = startI; i <= endI; i += 1) {
      for (let j = startJ; j <= endJ; j += 1) {
        arrayAttackIndexes.push(arrayIndexes[i][j]);
      }
    }
    return { arrayMoveIndexes: arrayMoveIndexes.filter(el => el !== undefined), arrayAttackIndexes: arrayAttackIndexes };
  }
}
