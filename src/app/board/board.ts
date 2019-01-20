import { DrawableClass } from './../drawable-class';
import { Spot } from './spot';
import { Connection } from './connection';
import Canvasimo from 'canvasimo';
import { ConnectionColor } from './connection-color.enum';
import { Player } from '../player';
import { NextColorService } from '../next-color.service';

export class Board implements DrawableClass {
  private width: number;
  private height: number;
  public spotSize: number;
  public offsetTop: number;
  public offsetBottom: number;
  public players: Player[];
  public currentPlayerIndex: number;
  public currentColor: ConnectionColor;

  constructor(public rows: Array<Spot[]>, public connections: Connection[], private nextColorService: NextColorService) {
  }

  public setPlayerCount(count: number): any {
    this.players = new Array<Player>(count);
    for (let i = 0; i < count; i++) {
      this.players[i] = new Player('P' + (i + 1));
    }
    this.currentPlayerIndex = 0;
    this.currentColor = this.nextColorService.getNextColor(this.currentPlayerIndex);
  }

  private getSmallestSide(): number {
    if (this.height < this.width) {
      return this.height;
    } else {
      return this.width;
    }
  }

  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    const smallestSide: number = this.getSmallestSide();

    this.offsetTop = smallestSide * 0.05;
    this.offsetBottom = smallestSide * 0.05;
    this.spotSize = (smallestSide - this.offsetTop - this.offsetBottom) / this.rows.length;
  }

  public update(): void {
    this.rows.forEach(row =>
      row.forEach(spot =>
        spot.update()
      )
    );
  }

  public draw(canvas: Canvasimo): void {
    this.rows.forEach(row =>
      row.forEach(spot =>
        spot.draw(canvas)
      )
    );
  }

  public onMouseMove(canvas: Canvasimo, e: MouseEvent): void {
    const { mouseX, mouseY } = this.calculateCanvasXY(canvas, e);

    const connectionsInFocus = this.connections.filter(c => c.isInFocus(mouseX, mouseY));
    if (connectionsInFocus.length === 1 && !connectionsInFocus[0].color) {
      connectionsInFocus[0].drawHighlight(canvas);
    }
  }

  public onMouseClick(canvas: Canvasimo, e: MouseEvent): void {
    // Calculate the x/y coordinates in canvas space.
    const { mouseX, mouseY } = this.calculateCanvasXY(canvas, e);

    const connectionsInFocus = this.connections.filter(c => c.isInFocus(mouseX, mouseY));
    if (connectionsInFocus.length === 1) {
      connectionsInFocus[0].setColor(this.players[this.currentPlayerIndex], this.currentColor);

      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      this.currentColor = this.nextColorService.getNextColor(this.currentPlayerIndex);
    }
  }

  public setNextColor(color: ConnectionColor): void {
    this.nextColorService.setNextColor(this.currentPlayerIndex, color);
  }

  public getCurrentHexColorString(): string {
    // tslint:disable-next-line:no-bitwise
    const red = this.currentColor & ConnectionColor.RED;
    // tslint:disable-next-line:no-bitwise
    const green = this.currentColor & ConnectionColor.GREEN;
    // tslint:disable-next-line:no-bitwise
    const blue = this.currentColor & ConnectionColor.BLUE;

    // tslint:disable-next-line:no-bitwise
    return '#' + ((1 << 24) + red + green + blue).toString(16).slice(1);
  }


  private calculateCanvasXY(canvas: Canvasimo, e: MouseEvent): { mouseX: number; mouseY: number; } {
    const mouseX = (e.x - canvas.getCanvas().offsetLeft) - (canvas.getCanvas().width / 2);
    const mouseY = (e.y - canvas.getCanvas().offsetTop) - this.offsetTop;
    return {mouseX, mouseY};
  }
}

