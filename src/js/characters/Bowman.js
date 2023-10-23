import Character from '../Character.js';

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 60;
    this.defence = 25;
  }
}