import { TestBed } from '@angular/core/testing';

import { BoardDrawingService } from './board-drawing.service';

describe('BoardDrawingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardDrawingService = TestBed.get(BoardDrawingService);
    expect(service).toBeTruthy();
  });
});
