import { ConnectionSlant } from './connection-type.enum';
import { ConnectionColor } from './connection-color.enum';
import { Spot } from './spot';
import { Board } from './board';

export class Connection {
  public board: Board;
  public minRowIndex: number;
  public minSpotIndex: number;
  public xOffsetStart: number;
  public yOffsetStart: number;
  public xOffsetEnd: number;
  public yOffsetEnd: number;
  public color: ConnectionColor;
  public spots: Spot[] = [];

  constructor(public type: ConnectionSlant) {
  }

}
