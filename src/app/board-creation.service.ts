import { Connection } from './board/connection';
import { Injectable } from '@angular/core';
import { Board } from './board/board';
import { Spot } from './board/spot';
import { concat } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardCreationService {

  constructor() { }

  public createBoard(rowCount: number): Board {
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
          lc = new Connection();
          connections.push(lc);
        } else {
          leftSpot = currentRow[currentRow.length - 1];
          lc = leftSpot.rc;
        }

        rc = new Connection();
        connections.push(rc);

        if (currentRow.length % 2 === 0) {
          hc = new Connection();
          connections.push(hc);
        } else {
          upSpot = previousRow[currentRow.length - 1];
          hc = upSpot.hc;
        }

        const spot: Spot = new Spot(lc, rc, hc);

        currentRow.push(spot);
      }
    }

    return new Board(rows, connections);
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
