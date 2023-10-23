import Character from '../Character.js';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 40;
    this.defence = 40;
  }
}