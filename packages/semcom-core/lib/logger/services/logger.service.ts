export abstract class LoggerService {

  public abstract log(level: string, message: string, payload?: any): void;

}
