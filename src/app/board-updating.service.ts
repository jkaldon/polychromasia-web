import { Connection } from './board/connection';
import { Injectable } from '@angular/core';
import { Board } from './board/board';
import { Spot } from './board/spot';
import { ConnectionSlant } from './board/connection-type.enum';

@Injectable({
  providedIn: 'root'
})
export class BoardUpdatingService {

  constructor() { }

  public update(board: Board): void {
    board.rows.forEach(row =>
      row.forEach(spot =>
        this.updateSpot(spot, board)
      )
    );
  }

  private updateSpot(spot: Spot, board: Board): void {
    if (spot.spotIndex % 2 === 0) {
      this.updateConnection(spot.lc, spot, board);
      this.updateConnection(spot.rc, spot, board);
      this.updateConnection(spot.hc, spot, board);
    }
  }

  private updateConnection(connection: Connection, spot: Spot, board: Board): void {
    const halfSpotSize = board.spotSize / 2;

    switch (connection.type) {
      case ConnectionSlant.Forward:
        if (connection.spots.length === 1) {
          connection.xOffsetStart = (connection.minRowIndex * -halfSpotSize) + (connection.minSpotIndex * halfSpotSize);
        } else {
          connection.xOffsetStart = halfSpotSize + (connection.minRowIndex * -halfSpotSize) + (connection.minSpotIndex * halfSpotSize);
        }
        connection.yOffsetStart = connection.minRowIndex * board.spotSize;

        connection.xOffsetEnd = connection.xOffsetStart - halfSpotSize;
        connection.yOffsetEnd = connection.yOffsetStart + board.spotSize;
        break;

      case ConnectionSlant.Back:
        connection.xOffsetStart = (connection.minRowIndex * -halfSpotSize) + (connection.minSpotIndex * halfSpotSize);
        connection.yOffsetStart = connection.minRowIndex * board.spotSize;

        connection.xOffsetEnd = connection.xOffsetStart + halfSpotSize;
        connection.yOffsetEnd = connection.yOffsetStart + board.spotSize;
        break;

      case ConnectionSlant.Horizontal:
        connection.xOffsetStart = -halfSpotSize + (connection.minRowIndex * -halfSpotSize) + (connection.minSpotIndex * halfSpotSize);
        connection.yOffsetStart = board.spotSize + (connection.minRowIndex * board.spotSize);

        connection.xOffsetEnd = connection.xOffsetStart + board.spotSize;
        connection.yOffsetEnd = connection.yOffsetStart;
        break;
    }
  }

  public setSize(board: Board, width: number, height: number): void {
    const smallestSide = (width < height) ? width : height;
    board.width = width;
    board.height = height;


    board.offsetTop = smallestSide * 0.05;
    board.offsetBottom = smallestSide * 0.05;
    board.spotSize = (smallestSide - board.offsetTop - board.offsetBottom) / board.rows.length;
  }


}
