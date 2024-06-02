class CodeAstRenderer {
  renderState;

  constructor(renderState) {
    this.renderState = renderState;
  }

  render(codeAst) {
    if (!codeAst) {
      return;
    }
    const statements = [];
    for (const statement of codeAst.body) {
      statements[statements.length] = this.renderStatement(statement);
    }
    return statements.join('<br>');
  }

  renderStatement(statement) {
    return statement.loc.source.toLowerCase().replace('down1', '<span class="error">down1</span>');
    // const parts = [];
    // for (const part of statement.body) {
    //   parts[parts.length] = part;
    // }
    // return parts.join('');
  }

}
