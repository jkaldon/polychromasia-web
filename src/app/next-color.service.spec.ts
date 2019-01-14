import { TestBed } from '@angular/core/testing';

import { NextColorService } from './next-color.service';

describe('NextColorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NextColorService = TestBed.get(NextColorService);
    expect(service).toBeTruthy();
  });
});
