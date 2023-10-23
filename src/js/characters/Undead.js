import Character from '../Character.js';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 80;
    this.defence = 10;
  }
}