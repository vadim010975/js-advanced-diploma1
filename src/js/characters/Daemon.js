import Character from '../Character.js';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.attack = 40;
    this.defence = 40;
  }
}