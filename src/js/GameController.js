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

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.gamePlay.redrawPositions(playersInit([
      {
        team: generateTeam([Bowman, Swordsman, Magician], 2, 4),
        cellsArray: [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
      },
      {
        team: generateTeam([Daemon, Undead, Vampire], 2, 4),
        cellsArray: [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63],
      },
    ]));
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    if (this.gamePlay.selectedCellIdx !== null) {
      this.gamePlay.deselectCell(this.gamePlay.selectedCellIdx);
    }
    const charEl = this.gamePlay.cells[index].querySelector('.character');
    if (charEl && (charEl.classList.contains('bowman') || charEl.classList.contains('swordsman') || charEl.classList.contains('magician'))) {
      this.gamePlay.selectCell(index);
      this.gamePlay.selectedCellIdx = index;
    } else {
      GamePlay.showError('Здесь нет твоего персонажа');
    }
  }

  onCellEnter(index) {
    const cellInfo = this.getCellInfo(index);
    console.log(cellInfo);
    if (!cellInfo.isEmpty) {
      // вывод информации title
      const message = this.showInformation(cellInfo.charEl);
      this.gamePlay.showCellTooltip(message, index);
      // если свой и не выбран
      if (cellInfo.role === 'ally' && !cellInfo.isSelected) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    } else {
      if (this.gamePlay.selectedCellIdx !== null && this.getIndexesMoves().includes(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      }
    }


  }

  onCellLeave(index) {
    if (this.gamePlay.cells[index].querySelector('.character')) {
      this.gamePlay.hideCellTooltip(index);
    };
    this.gamePlay.deselectCell(index);
    this.gamePlay.setCursor(cursors.auto);
  }

  showInformation(charEl) {
    return `\u{1F396}${charEl.dataset.level} \u{2694}${charEl.dataset.attack} \u{1F6E1}${charEl.dataset.defence} \u{2764}${charEl.dataset.health}`;
  }



  getCellInfo(index) {
    const cellInfo = {
      isEmpty: true,
      character: null,
      charEl: null,
      role: null,
      isSelected: false,
    };
    const cellEl = this.gamePlay.cells[index];
    const charEl = cellEl.querySelector('.character');
    if (charEl) {
      cellInfo.isEmpty = false;
      cellInfo.charEl = charEl;
      if (charEl.classList.contains('swordsman')) {
        cellInfo.character = 'swordsman';
      } else if (charEl.classList.contains('bowman')) {
        cellInfo.character = 'bowman';
      } else if (charEl.classList.contains('magician')) {
        cellInfo.character = 'magician';
      } else if (charEl.classList.contains('vampire')) {
        cellInfo.character = 'vampire';
      } else if (charEl.classList.contains('undead')) {
        cellInfo.character = 'undead';
      } else if (charEl.classList.contains('daemon')) {
        cellInfo.character = 'daemon';
      }
      cellInfo.role = cellInfo.character === 'swordsman' || cellInfo.character === 'bowman' || cellInfo.character === 'magician' ? 'ally' : 'enemy';
      if (cellEl.classList.contains('selected')) {
        cellInfo.isSelected = true;
      }
    }
    return cellInfo;
  }








  getIndexesMoves() {
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
    const char = this.getCellInfo(this.gamePlay.selectedCellIdx).character;
    let countStep;
    switch (char) {
      case 'swordsman':
        countStep = 4;
        break;
      case 'bowman':
        countStep = 2;
        break;
      case 'magician':
        countStep = 1;
    }
    const arrayIndexesMoves = [];
    for (let step = 1; step <= countStep; step += 1) {
      arrayIndexesMoves.push(arrayIndexes[indexI][indexJ - step]);
      arrayIndexesMoves.push(arrayIndexes[indexI][indexJ + step]);
      if (indexI - step >= 0) {
        arrayIndexesMoves.push(arrayIndexes[indexI - step][indexJ]);
        arrayIndexesMoves.push(arrayIndexes[indexI - step][indexJ - step]);
        arrayIndexesMoves.push(arrayIndexes[indexI - step][indexJ + step]);
      }
      if (indexI + step < arrayIndexes.length) {
        arrayIndexesMoves.push(arrayIndexes[indexI + step][indexJ]);
        arrayIndexesMoves.push(arrayIndexes[indexI + step][indexJ + step]);
        arrayIndexesMoves.push(arrayIndexes[indexI + step][indexJ - step]);
      }
    }
    return arrayIndexesMoves.filter(el => el !== undefined);
  }
}
