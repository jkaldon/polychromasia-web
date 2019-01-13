import { DrawableClass } from './../drawable-class';
import { Connection } from './connection';
import { SpotColor } from './spot-color.enum';
import { Player } from '../player';
import Canvasimo from 'canvasimo';
import { Board } from './board';
import { ConnectionColor } from './connection-color.enum';

export class Spot implements DrawableClass {
  private board: Board;

  constructor(public spotIndex: number, public rowIndex: number, public lc: Connection, public rc: Connection, public hc: Connection) {
    lc.spots.push(this);
    rc.spots.push(this);
    hc.spots.push(this);
  }

  public player: Player;

  public setBoard(board: Board): void {
    this.board = board;
    this.lc.setBoard(board);
    this.rc.setBoard(board);
    this.hc.setBoard(board);
  }

  public update(): any {
    if (this.spotIndex % 2 === 0) {
      this.lc.update();
      this.rc.update();
      this.hc.update();
    }
  }

  public draw(canvas: Canvasimo): void {
    const colorHexString = this.getHexColorString();
    if (colorHexString) {
      const lcStart = { x: this.lc.xOffsetStart, y: this.lc.yOffsetStart };
      const lcEnd = { x: this.lc.xOffsetEnd, y: this.lc.yOffsetEnd };
      const rcStart = { x: this.rc.xOffsetStart, y: this.rc.yOffsetStart };
      const rcEnd = { x: this.rc.xOffsetEnd, y: this.rc.yOffsetEnd };

      canvas.beginPath();
      canvas.fillPath([rcStart, rcEnd, lcEnd, lcStart], colorHexString);
      canvas.closePath();
    }
    if (this.spotIndex % 2 === 0) {
      this.lc.draw(canvas);
      this.rc.draw(canvas);
      this.hc.draw(canvas);
    }
  }

  public color(): SpotColor {
    let result: SpotColor;
    if (this.lc.color && this.rc.color && this.hc.color) {
      // tslint:disable-next-line:no-bitwise
      result = this.lc.color | this.rc.color | this.hc.color;
    }
    return result;
  }

  private getHexColorString(): string {
    const color = this.color();
    if (color) {
      // tslint:disable-next-line:no-bitwise
      const red = color & ConnectionColor.RED;
      // tslint:disable-next-line:no-bitwise
      const green = color & ConnectionColor.GREEN;
      // tslint:disable-next-line:no-bitwise
      const blue = color & ConnectionColor.BLUE;

      // tslint:disable-next-line:no-bitwise
      return '#' + ((1 << 24) + red + green + blue).toString(16).slice(1);
    }
    return;
  }

}
