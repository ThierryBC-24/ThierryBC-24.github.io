import { TestBed } from '@angular/core/testing';

import { CvsReaderService } from './cvs-reader.service';

describe('CvsReaderService', () => {
  let service: CvsReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvsReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
