import { Connection } from './board/connection';
import { Injectable } from '@angular/core';
import { Board } from './board/board';
import { Spot } from './board/spot';
import { ConnectionSlant } from './board/connection-type.enum';
import { NextColorService } from './next-color.service';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class BoardCreationService {

  constructor(private nextColorService: NextColorService) { }

  public createBoard(playerCount: number, rowCount: number): Board {
    const rows: Array<Spot[]> = new Array(rowCount);
    const connections: Connection[] = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      rows[rowIndex] = [];
    }

    let previousRow: Spot[];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      if (rowIndex > 0) {
        previousRow = rows[rowIndex - 1];
      }

      const currentRow = rows[rowIndex];
      const rowSpotCount = this.calculateSpotsInRow(rowIndex);

      while (currentRow.length < rowSpotCount) {
        let leftSpot: Spot;
        let upSpot: Spot;
        let rc: Connection;
        let lc: Connection;
        let hc: Connection;

        if (currentRow.length === 0) {
          lc = new Connection(ConnectionSlant.Forward);
          connections.push(lc);
        } else {
          leftSpot = currentRow[currentRow.length - 1];
          lc = leftSpot.rc;
        }

        if (currentRow.length % 2 === 0) {
          rc = new Connection(ConnectionSlant.Back);
          connections.push(rc);
        } else {
          rc = new Connection(ConnectionSlant.Forward);
          connections.push(rc);
        }

        if (currentRow.length % 2 === 0) {
          hc = new Connection(ConnectionSlant.Horizontal);
          connections.push(hc);
        } else {
          upSpot = previousRow[currentRow.length - 1];
          hc = upSpot.hc;
        }

        const spot: Spot = new Spot(currentRow.length, rowIndex, lc, rc, hc);

        currentRow.push(spot);
      }
    }

    const players: Array<Player> = new Array<Player>(playerCount);
    for (let i = 0; i < playerCount; i++) {
      players[i] = new Player('P' + (i + 1));
    }

    const board = new Board(players, rows, connections);

    rows.forEach(row =>
      row.forEach(spot => {
        this.afterBoardCreated(spot.lc);
        this.afterBoardCreated(spot.rc);
        this.afterBoardCreated(spot.hc);
      })
    );

    board.currentColor = this.nextColorService.getNextColor(board.currentPlayerIndex);

    return board;
  }

  private afterBoardCreated(connection: Connection): void {
    if (!connection.minRowIndex) {
      connection.minRowIndex = connection.spots
          .reduce((min, s) => Math.min(min, s.rowIndex), 254);

      const spotsOnRow = connection.spots
          .filter(s => s.rowIndex === connection.minRowIndex);

      connection.minSpotIndex = spotsOnRow
          .reduce((min, s) => Math.min(min, s.spotIndex), 254);
    }
  }

  private calculateSpotsInRow(rowIndex: number) {
    return (rowIndex + 1) * 2 - 1;
  }

  // private calculateSpotCount(rowCount: number) {
  //   return rowCount * rowCount;
  // }

  // private calculateConnectionCount(rowCount: number) {
  //   return 3 * rowCount * (rowCount + 1) / 2;
  // }
}
