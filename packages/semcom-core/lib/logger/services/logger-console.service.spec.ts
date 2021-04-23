import { LoggerConsoleService } from './logger-console.service';

describe('LoggerConsoleService', () => {

  it('should be correctly instantiated', (() => {
    const service = new LoggerConsoleService();

    expect(service).toBeTruthy();
  }));
});
