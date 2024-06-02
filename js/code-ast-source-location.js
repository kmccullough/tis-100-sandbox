class CodeAstSourceLocation {
  source;
  start;
  end;

  constructor(source, start = null, end = null) {
    this.source = source;
    this.start = start;
    this.end = end;
  }
}
