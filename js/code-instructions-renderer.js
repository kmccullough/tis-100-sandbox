const errorStart = '<span class="error">';
const errorEnd = '</span>';
const error = code => `${errorStart}${code}${errorEnd}`;

const matchInstruction = /^([a-z]+:\s*)?([a-z0-9]+)([^a-z0-9].*)$/;
const matchOperands = /^(\s+|,)([a-z0-9]+)([^a-z0-9].*)?$/;

class CodeInstructionsRenderer {
  renderState;

  constructor(renderState) {
    this.renderState = renderState;
  }

  render(codeInstructions) {
    if (!codeInstructions) {
      return;
    }
    const instructions = [];
    let hasError = false;
    for (const instruction of codeInstructions.instructions) {
      instructions[instructions.length] = this.renderInstruction(instruction, !hasError);
      hasError ||= !!instruction.error;
    }
    return instructions.join('<br>');
  }

  renderInstruction(instruction, displayError) {
    if (!displayError || !instruction.error) {
      return instruction.source;
    }
    let code = instruction.source.toLowerCase();
    if (instruction.errorIndex === 0) {
      return error(code);
    }
    if (instruction.errorIndex === 1) {
      const match = code.match(matchInstruction);
      if (match) {
        const [ , label = '', op, rest ] = match;
        return label + error(op) + rest;
      }
      return code;
    }
    const index = [].concat(instruction.errorIndex);
    const match = code.match(matchInstruction);
    if (match) {
      let [ , label = '', op, rest ] = match;
      code = label + op;
      let matchOps, operand, isErrorSet, delimiter, i = 2;
      while (rest && i <= (index[1] ?? index[0]) && (matchOps = rest.match(matchOperands))) {
        [ , delimiter, operand, rest ] = matchOps;
        code += delimiter;
        if (i++ >= index[0] && !isErrorSet) {
          code += errorStart;
          isErrorSet = true;
        }
        code += operand;
      }
      if (isErrorSet) {
        code += errorEnd + (rest || '');
      }
    }
    if (instruction.error) {
      console.log(instruction.error);
    }
    return code;
  }
}
