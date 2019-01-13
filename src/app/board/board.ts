import { DrawableClass } from './../drawable-class';
import { Spot } from './spot';
import { Connection } from './connection';
import Canvasimo from 'canvasimo';
import { ConnectionColor } from './connection-color.enum';

export class Board implements DrawableClass {
  private width: number;
  private height: number;
  private nextColor: number;
  public spotSize: number;
  public offsetTop: number;
  public offsetBottom: number;

  constructor(public rows: Array<Spot[]>, public connections: Connection[]) {
    this.nextColor = ConnectionColor.GREEN;
  }

  setNextColor(color: ConnectionColor): any {
    this.nextColor = color;
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

    // TODO: BUG: Why does the entire board turn red when this code is missing?
    canvas.fillStar(mouseX, mouseY, 5, 5, false, 'red');
    canvas.save();

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
      connectionsInFocus[0].color = this.nextColor;
      console.log('onMouseClick()');
      console.log(connectionsInFocus);
    }
  }
  private calculateCanvasXY(canvas: Canvasimo, e: MouseEvent): { mouseX: number; mouseY: number; } {
    const mouseX = (e.x - canvas.getCanvas().offsetLeft) - (canvas.getCanvas().width / 2);
    const mouseY = (e.y - canvas.getCanvas().offsetTop) - this.offsetTop;
    return {mouseX, mouseY};
  }
}

