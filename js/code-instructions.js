class CodeInstructions {
  source;
  instructions;

  constructor(source) {
    this.setSource(source);
  }

  setSource(source) {
    this.source = source;
    this.processSource();
    return this;
  }

  processSource() {
    const instructions = this.instructions = [];
    const lines = String(this.source || '').split('\n');
    for (let i = 0; i < lines.length; ++i) {
      instructions[i] = new CodeInstruction(i + 1, lines[i]);
    }
  }
}
