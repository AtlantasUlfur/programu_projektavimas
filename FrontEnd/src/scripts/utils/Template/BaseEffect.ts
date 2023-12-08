export abstract class BaseEffect {
    public templateMethod(): any {
      this.initialise();
      this.setEffect();
      return this.applyEffect();
    }
  
    protected abstract initialise(): void;
    protected setEffect(): void {};
    protected abstract applyEffect(): any;
}
