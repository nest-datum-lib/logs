import { Test, TestingModule } from '@nestjs/testing';
import { WarningController } from './warning.controller';

describe('WarningController', () => {
  let controller: WarningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarningController],
    }).compile();

    controller = module.get<WarningController>(WarningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
