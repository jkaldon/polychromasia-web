import { Connection } from './connection';
import { SpotColor } from './spot-color.enum';
import { Player } from '../player';

export class Spot {
  public player: Player;

  constructor(public spotIndex: number, public rowIndex: number, public lc: Connection, public rc: Connection, public hc: Connection) {
    lc.spots.push(this);
    rc.spots.push(this);
    hc.spots.push(this);
  }

  public getColor(): SpotColor {
    let result: SpotColor;
    if (this.lc.color && this.rc.color && this.hc.color) {
      // tslint:disable-next-line:no-bitwise
      result = this.lc.color | this.rc.color | this.hc.color;
    }
    return result;
  }
}
