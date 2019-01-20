import { SpotColor } from './board/spot-color.enum';
import { Injectable } from '@angular/core';
import { Board } from './board/board';
import Canvasimo from 'canvasimo';
import { Spot } from './board/spot';
import { ConnectionSlant } from './board/connection-type.enum';
import { ConnectionColor } from './board/connection-color.enum';
import { Connection } from './board/connection';

@Injectable({
  providedIn: 'root'
})
export class BoardDrawingService {

  constructor() { }

  public draw(board: Board, canvas: Canvasimo): void {
    board.rows.forEach(row =>
      row.forEach(spot =>
        this.drawSpot(spot, board, canvas)
      )
    );
  }

  private drawSpot(spot: Spot, board: Board, canvas: Canvasimo): void {
    const colorHexString = this.getHexColorString(spot.getColor());
    if (colorHexString) {
      const lcStart = { x: spot.lc.xOffsetStart, y: spot.lc.yOffsetStart };
      const lcEnd = { x: spot.lc.xOffsetEnd, y: spot.lc.yOffsetEnd };
      const rcStart = { x: spot.rc.xOffsetStart, y: spot.rc.yOffsetStart };
      const rcEnd = { x: spot.rc.xOffsetEnd, y: spot.rc.yOffsetEnd };

      canvas.beginPath();
      canvas.fillPath([rcStart, rcEnd, lcEnd, lcStart], colorHexString);
      canvas.closePath();

      canvas.beginPath();
      canvas.setTextAlign('center');
      if (spot.lc.type === ConnectionSlant.Forward) {
        const initialsX = Math.max(lcStart.x, lcEnd.x);
        const initialsY = lcStart.y + ((lcEnd.y - lcStart.y) * 2 / 3);
        canvas.strokeText(spot.player.initials, initialsX, initialsY, board.spotSize / 2, '#000000');
      } else {
        const initialsX = Math.max(lcStart.x, lcEnd.x);
        const initialsY = lcStart.y + ((lcEnd.y - lcStart.y) / 2);
        canvas.strokeText(spot.player.initials, initialsX, initialsY, board.spotSize / 2, '#000000');
      }
      canvas.closePath();
    }
    if (spot.spotIndex % 2 === 0) {
      this.drawConnection(spot.lc, spot, board, canvas);
      this.drawConnection(spot.rc, spot, board, canvas);
      this.drawConnection(spot.hc, spot, board, canvas);
    }
  }

  private drawConnection(connection: Connection, spot: Spot, board: Board, canvas: Canvasimo): void {
    canvas.beginPath();
    if (connection.color) {
      canvas.setStrokeWidth(4);
    } else {
      canvas.setStrokeDash([10]);
    }

    let color: ConnectionColor;
    if (connection.color) {
      color = connection.color;
    } else {
      color = 0x505050;
    }

    canvas.strokeLine(
      connection.xOffsetStart,
      connection.yOffsetStart,
      connection.xOffsetEnd,
      connection.yOffsetEnd,
      this.getHexColorString(color)
    );
    if (connection.color) {
      canvas.setStrokeWidth(1);
    } else {
      canvas.setStrokeDash([]);
    }
    canvas.closePath();

    canvas.beginPath();
    canvas.fillCircle(connection.xOffsetStart, connection.yOffsetStart, 3, false, '#505050');
    canvas.fillCircle(connection.xOffsetEnd, connection.yOffsetEnd, 3, false, '#505050');
    canvas.closePath();
  }

  public drawConnectionHighlight(connection: Connection, canvas: Canvasimo): void {
    const hexColorString = '#707070';
    const highlightOffset = 1;
    canvas.beginPath();
    switch (connection.type) {
      case ConnectionSlant.Forward:
        canvas.strokeLine(
          connection.xOffsetStart - highlightOffset,
          connection.yOffsetStart - highlightOffset,
          connection.xOffsetEnd - highlightOffset,
          connection.yOffsetEnd - highlightOffset,
          hexColorString
        );
        canvas.strokeLine(
          connection.xOffsetStart + highlightOffset,
          connection.yOffsetStart + highlightOffset,
          connection.xOffsetEnd + highlightOffset,
          connection.yOffsetEnd + highlightOffset,
          hexColorString
        );
        break;

      case ConnectionSlant.Back:
        canvas.strokeLine(
          connection.xOffsetStart - highlightOffset,
          connection.yOffsetStart + highlightOffset,
          connection.xOffsetEnd - highlightOffset,
          connection.yOffsetEnd + highlightOffset,
          hexColorString
        );
        canvas.strokeLine(
          connection.xOffsetStart + highlightOffset,
          connection.yOffsetStart - highlightOffset,
          connection.xOffsetEnd + highlightOffset,
          connection.yOffsetEnd - highlightOffset,
          hexColorString
        );
      break;

      case ConnectionSlant.Horizontal:
        canvas.strokeLine(
          connection.xOffsetStart,
          connection.yOffsetStart - highlightOffset,
          connection.xOffsetEnd,
          connection.yOffsetEnd - highlightOffset,
          hexColorString
        );
        canvas.strokeLine(
          connection.xOffsetStart,
          connection.yOffsetStart + highlightOffset,
          connection.xOffsetEnd,
          connection.yOffsetEnd + highlightOffset,
          hexColorString
        );
      break;
    }
    canvas.closePath();
  }


  public getHexColorString(color: ConnectionColor | SpotColor): string {
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
