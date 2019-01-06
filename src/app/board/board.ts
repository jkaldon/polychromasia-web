import { Spot } from './spot';
import { Connection } from './connection';

export class Board {
  constructor(public rows: Array<Spot[]>, public connections: Connection[]) {
  }
}

