import { Test, TestingModule } from '@nestjs/testing';
import { ErrService } from './err.service';

describe('ErrService', () => {
  let service: ErrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrService],
    }).compile();

    service = module.get<ErrService>(ErrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
