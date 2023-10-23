import Character from '../Character.js';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 60;
    this.defence = 25;
  }
}