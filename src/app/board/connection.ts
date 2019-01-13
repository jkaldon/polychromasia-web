import { ConnectionSlant } from './connection-type.enum';
import { ConnectionColor } from './connection-color.enum';
import { Spot } from './spot';
import { DrawableClass } from '../drawable-class';
import Canvasimo from 'canvasimo';
import { Board } from './board';

export class Connection implements DrawableClass {
  private board: Board;
  private minRowIndex = -1;
  private minSpotIndex = -1;
  public xOffsetStart: number;
  public yOffsetStart: number;
  public xOffsetEnd: number;
  public yOffsetEnd: number;
  public color: ConnectionColor;
  public spots: Spot[] = [];

  constructor(public type: ConnectionSlant) {
  }

  public setBoard(board: Board): void {
    this.board = board;

    this.afterBoardCreated();
  }

  private afterBoardCreated(): void {
    if (this.minRowIndex === -1) {
      this.minRowIndex = this.spots
          .reduce((min, s) => Math.min(min, s.rowIndex), 254);

      const spotsOnRow = this.spots
          .filter(s => s.rowIndex === this.minRowIndex);

      this.minSpotIndex = spotsOnRow
          .reduce((min, s) => Math.min(min, s.spotIndex), 254);
    }
  }

  public update(): void {
    const halfSpotSize = this.board.spotSize / 2;

    switch (this.type) {
      case ConnectionSlant.Forward:
        if (this.spots.length === 1) {
          this.xOffsetStart = (this.minRowIndex * -halfSpotSize) + (this.minSpotIndex * halfSpotSize);
        } else {
          this.xOffsetStart = halfSpotSize + (this.minRowIndex * -halfSpotSize) + (this.minSpotIndex * halfSpotSize);
        }
        this.yOffsetStart = this.minRowIndex * this.board.spotSize;

        this.xOffsetEnd = this.xOffsetStart - halfSpotSize;
        this.yOffsetEnd = this.yOffsetStart + this.board.spotSize;
        break;

      case ConnectionSlant.Back:
        this.xOffsetStart = (this.minRowIndex * -halfSpotSize) + (this.minSpotIndex * halfSpotSize);
        this.yOffsetStart = this.minRowIndex * this.board.spotSize;

        this.xOffsetEnd = this.xOffsetStart + halfSpotSize;
        this.yOffsetEnd = this.yOffsetStart + this.board.spotSize;
        break;

      case ConnectionSlant.Horizontal:
        this.xOffsetStart = -halfSpotSize + (this.minRowIndex * -halfSpotSize) + (this.minSpotIndex * halfSpotSize);
        this.yOffsetStart = this.board.spotSize + (this.minRowIndex * this.board.spotSize);

        this.xOffsetEnd = this.xOffsetStart + this.board.spotSize;
        this.yOffsetEnd = this.yOffsetStart;
        break;
    }
  }

  public draw(canvas: Canvasimo): void {
    canvas.beginPath();
    if (this.color) {
      canvas.setStrokeWidth(4);
    } else {
      canvas.setStrokeDash([10]);
    }
    canvas.strokeLine(this.xOffsetStart, this.yOffsetStart, this.xOffsetEnd, this.yOffsetEnd, this.getHexColorString());
    if (this.color) {
      canvas.setStrokeWidth(1);
    } else {
      canvas.setStrokeDash([]);
    }
    canvas.closePath();
  }

  private getHexColorString(): string {
    if (this.color) {
      // tslint:disable-next-line:no-bitwise
      const red = this.color & ConnectionColor.RED;
      // tslint:disable-next-line:no-bitwise
      const green = this.color & ConnectionColor.GREEN;
      // tslint:disable-next-line:no-bitwise
      const blue = this.color & ConnectionColor.BLUE;

      // tslint:disable-next-line:no-bitwise
      return '#' + ((1 << 24) + red + green + blue).toString(16).slice(1);
    }
    return '#505050';
  }

  public drawHighlight(canvas: Canvasimo): void {
    const hexColorString = '#707070';
    const highlightOffset = 1;
    canvas.beginPath();
    switch (this.type) {
      case ConnectionSlant.Forward:
        canvas.strokeLine(
          this.xOffsetStart - highlightOffset,
          this.yOffsetStart - highlightOffset,
          this.xOffsetEnd - highlightOffset,
          this.yOffsetEnd - highlightOffset,
          hexColorString
        );
        canvas.strokeLine(
          this.xOffsetStart + highlightOffset,
          this.yOffsetStart + highlightOffset,
          this.xOffsetEnd + highlightOffset,
          this.yOffsetEnd + highlightOffset,
          hexColorString
        );
        break;

      case ConnectionSlant.Back:
        canvas.strokeLine(
          this.xOffsetStart - highlightOffset,
          this.yOffsetStart + highlightOffset,
          this.xOffsetEnd - highlightOffset,
          this.yOffsetEnd + highlightOffset,
          hexColorString
        );
        canvas.strokeLine(
          this.xOffsetStart + highlightOffset,
          this.yOffsetStart - highlightOffset,
          this.xOffsetEnd + highlightOffset,
          this.yOffsetEnd - highlightOffset,
          hexColorString
        );
      break;

      case ConnectionSlant.Horizontal:
        canvas.strokeLine(
          this.xOffsetStart,
          this.yOffsetStart - highlightOffset,
          this.xOffsetEnd,
          this.yOffsetEnd - highlightOffset,
          hexColorString
        );
        canvas.strokeLine(
          this.xOffsetStart,
          this.yOffsetStart + highlightOffset,
          this.xOffsetEnd,
          this.yOffsetEnd + highlightOffset,
          hexColorString
        );
      break;
    }
    canvas.closePath();
  }

  public isInFocus(mouseX: number, mouseY: number): boolean {
    // Based on the algorithm posted here:
    // https://stackoverflow.com/a/1088058
    const distanceFromStartToEnd = Math.sqrt(
      Math.pow(this.xOffsetEnd - this.xOffsetStart, 2) + Math.pow(this.yOffsetEnd - this.yOffsetStart, 2)
    );
    const dx = (this.xOffsetEnd - this.xOffsetStart) / distanceFromStartToEnd;
    const dy = (this.yOffsetEnd - this.yOffsetStart) / distanceFromStartToEnd;
    const t = dx * (mouseX - this.xOffsetStart) + dy * (mouseY - this.yOffsetStart);
    const nearestPointOnLineX = t * dx + this.xOffsetStart;
    const nearestPointOnLineY = t * dy + this.yOffsetStart;
    const distanceFromMouseToNearestPointOnLine = Math.sqrt(
        Math.pow(nearestPointOnLineX - mouseX, 2) + Math.pow(nearestPointOnLineY - mouseY, 2)
    );
    const distanceFromNearestPointOnLineToStart = Math.sqrt(
        Math.pow(nearestPointOnLineX - this.xOffsetStart, 2) + Math.pow(nearestPointOnLineY - this.yOffsetStart, 2)
    );
    const distanceFromNearestPointOnLineToEnd = Math.sqrt(
        Math.pow(nearestPointOnLineX - this.xOffsetEnd, 2) + Math.pow(nearestPointOnLineY - this.yOffsetEnd, 2)
    );
    return distanceFromMouseToNearestPointOnLine < 4
        && distanceFromNearestPointOnLineToEnd < distanceFromStartToEnd
        && distanceFromNearestPointOnLineToStart < distanceFromStartToEnd;
  }
}
