import { TestBed } from '@angular/core/testing';

import { BoardUpdatingService } from './board-updating.service';

describe('BoardUpdatingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardUpdatingService = TestBed.get(BoardUpdatingService);
    expect(service).toBeTruthy();
  });
});
