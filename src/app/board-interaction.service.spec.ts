import { TestBed } from '@angular/core/testing';

import { BoardInteractionService } from './board-interaction.service';

describe('BoardInteractionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardInteractionService = TestBed.get(BoardInteractionService);
    expect(service).toBeTruthy();
  });
});
