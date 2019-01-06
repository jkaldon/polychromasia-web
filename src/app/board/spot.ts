import { Connection } from './connection';
import { SpotColor } from './spot-color.enum';
import { Player } from '../player';

export class Spot {
  constructor(public lc: Connection, public rc: Connection, public hc: Connection) {
    lc.spots.push(this);
    rc.spots.push(this);
    hc.spots.push(this);
  }

  public player: Player;

  public color(): SpotColor {
    let result: SpotColor = 0x0;
    if (this.lc) {
      // tslint:disable-next-line:no-bitwise
      result = result | this.lc.color;
    }
    if (this.rc) {
      // tslint:disable-next-line:no-bitwise
      result = result | this.rc.color;
    }
    if (this.hc) {
      // tslint:disable-next-line:no-bitwise
      result = result | this.hc.color;
    }
    return result;
  }
}
