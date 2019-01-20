import { Spot } from './spot';
import { Connection } from './connection';
import { ConnectionColor } from './connection-color.enum';
import { Player } from '../player';

export class Board {
  public width: number;
  public height: number;
  public spotSize: number;
  public offsetTop: number;
  public offsetBottom: number;
  public currentPlayerIndex: number;
  public currentColor: ConnectionColor;

  constructor(public players: Player[], public rows: Array<Spot[]>, public connections: Connection[]) {
    this.currentPlayerIndex = 0;
  }

}

