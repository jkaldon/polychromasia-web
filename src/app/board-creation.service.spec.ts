import { TestBed } from '@angular/core/testing';

import { BoardCreationService } from './board-creation.service';
import { Board } from './board/board';
import { Spot } from './board/spot';

describe('BoardCreationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardCreationService = TestBed.get(BoardCreationService);
    expect(service).toBeTruthy();
  });

  it('should have only 1 or 2 spots assigned to each connection', () => {
    const service: BoardCreationService = TestBed.get(BoardCreationService);

    const board: Board = service.createBoard(3);
    board.connections.forEach(c => {
      expect(c.spots.length).toBeGreaterThan(0);
      expect(c.spots.length).toBeLessThan(3);
    });
  });

  it('every spot should have connections that refer back to the spot.', () => {
    const service: BoardCreationService = TestBed.get(BoardCreationService);
    const board: Board = service.createBoard(3);

    board.rows.forEach(row => {
      row.forEach(spot => {
        expect(spot.lc.spots).toContain(spot);
        expect(spot.rc.spots).toContain(spot);
        expect(spot.hc.spots).toContain(spot);
      });
    });
  });

  it('every spot should be connected correctly to it\'s neighbor spots', () => {
    const service: BoardCreationService = TestBed.get(BoardCreationService);
    const board: Board = service.createBoard(2);
    const firstRow = board.rows[0];
    const secondRow = board.rows[1];

    // Row 0, Spot 0
    expect(firstRow[0].lc.spots.length).toEqual(1, 'firstRow[0] should have a left connection with only one spot assigned');
    expect(firstRow[0].rc.spots.length).toEqual(1, 'firstRow[0] should have a right connection with only one spot assigned');
    expect(firstRow[0].hc.spots.length).toEqual(2, 'firstRow[0] should have a horizontal connection with two spots');
    expect(firstRow[0].hc.spots).toContain(secondRow[1], 'firstRow[0]\'s horizontal connection should reference the spot secondRow[1]');

    // Row 1, Spot 0
    expect(secondRow[0].lc.spots.length).toEqual(1, 'secondRow[0] should have a left connection with only one spot assigned');
    expect(secondRow[0].rc.spots.length).toEqual(2, 'secondRow[0] should have a right connection with two spots assigned');
    expect(secondRow[0].hc.spots.length).toEqual(1, 'secondRow[0] should have a horizontal connection with only one spot assigned');
    expect(secondRow[0].rc.spots).toContain(secondRow[1], 'secondRow[0]\'s right connection should reference the spot secondRow[1]');

    // Row 1, Spot 1
    expect(secondRow[1].lc.spots.length).toEqual(2, 'secondRow[1] should have a left connection with two spots assigned');
    expect(secondRow[1].rc.spots.length).toEqual(2, 'secondRow[1] should have a right connection with two spots assigned');
    expect(secondRow[1].hc.spots.length).toEqual(2, 'secondRow[1] should have a horizontal connection with two spots assigned');
    expect(secondRow[1].lc.spots).toContain(secondRow[0], 'secondRow[1]\'s left connection should reference the spot secondRow[0]');
    expect(secondRow[1].rc.spots).toContain(secondRow[2], 'secondRow[1]\'s right connection should reference the spot secondRow[2]');
    expect(secondRow[1].hc.spots).toContain(firstRow[0], 'secondRow[1]\'s horizontal connection should reference the spot firstRow[0]');

    // Row 1, Spot 2
    expect(secondRow[2].lc.spots.length).toEqual(2, 'secondRow[2] should have a left connection with two spots assigned');
    expect(secondRow[2].rc.spots.length).toEqual(1, 'secondRow[2] should have a right connection with only one spot assigned');
    expect(secondRow[2].hc.spots.length).toEqual(1, 'secondRow[2] should have a horizontal connection with only one spot assigned');
    expect(secondRow[2].lc.spots).toContain(secondRow[1], 'secondRow[2]\'s left connection should reference the spot secondRow[1]');
  });

});
