class Context {
    variables: { [key: string]: number } = {};
  
    getVariable(name: string): number | undefined {
      return this.variables[name];
    }
  
    setVariable(name: string, value: number): void {
      this.variables[name] = value;
    }
  }
  