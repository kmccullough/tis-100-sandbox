class CodeAstStatement {
  loc;
  body;

  constructor(sourceLocation) {
    this.setSourceLocation(sourceLocation);
  }

  setSourceLocation(sourceLocation) {
    this.loc = sourceLocation;
    this.processSource();
    return this;
  }

  processSource() {
    // const body = this.body = [];
    // const lines = String(this.loc.source || '').split('\n');
    // for (let i = 0; i < lines.length; ++i) {
    //   body[i] = new CodeAstStatement(new CodeAstSourceLocation(
    //     lines[i],
    //     { line: i + 1, column: 0 },
    //     { line: i + 2, column: lines[i].length },
    //   ));
    // }
  }

}
