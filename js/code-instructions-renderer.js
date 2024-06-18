const wrap = (code, type = null) => {
  const el = type ? document.createElement('span') : document.createTextNode(code);
  if (type) {
    el.className = `code-${type}`;
    if (typeof code === 'string') {
      el.innerText = code;
    } else {
      el.append(code);
    }
  }
  return el;
};
const wrapError = code => wrap(code, 'error');
const wrapLabel = code => wrap(code, 'label');
const wrapOp = code => wrap(code, 'op');
const wrapVar = code => wrap(code, 'var');
const wrapConst = code => wrap(code, 'const')
const wrapComment = code => wrap(code, 'comment');

const matchInstruction = /^(\s*)(?:([a-z][a-z0-9]*):)?(\s*)([a-z0-9]+)([^a-z0-9].*)?$/i;
const matchOperands = /(\s+|\s*,\s*)([a-z0-9]+)/gi;
const matchComment = /^(.*)(#.*)?$/;
const matchVar = /[a-z_][a-z0-9_]+/i;

const SELECTION_KEYS = [
  { instruction: 'selectionStart', container: '_startContainer', offset: '_startOffset' },
  { instruction: 'selectionEnd', container: '_endContainer', offset: '_endOffset' },
];

export class CodeInstructionsRenderer {
  renderState;

  _startContainer;
  _startOffset;
  _endContainer;
  _endOffset;

  constructor(renderState) {
    this.renderState = renderState;
  }

  render(codeInstructions) {
    if (!codeInstructions) {
      return;
    }
    const nodes = [];
    let hasError = false;
    this._startContainer = this._endContainer = null;
    for (const instruction of codeInstructions.instructions) {
      if (nodes.length) {
        nodes[nodes.length] = document.createElement('br');
      }
      nodes[nodes.length] = this.renderInstruction(instruction, !hasError);
      hasError ||= !!instruction.error;
    }
    return {
      startContainer: this._startContainer,
      startOffset: this._startContainer && this._startOffset,
      endContainer: this._endContainer,
      endOffset: this._endContainer && this._endOffset,
      nodes,
    };
  }

  renderInstruction(instruction, displayError) {
    let { source } = instruction;
    let node = document.createElement('span');
    node.className = 'code-line';

    const setSelection = (position, length, container) => {
      for (const keys of SELECTION_KEYS) {
        const cont = this[keys.container];
        const selection = instruction[keys.instruction] ?? -1;
        if (!cont
          && selection >= position
          && selection <= position + length
        ) {
          this[keys.container] = container;
          this[keys.offset] = selection - position;
        }
      }
    };

    if (instruction.error) {
      // TODO output error above node
      console.log(instruction.error);
    }

    let index = 0;
    let match = source.match(matchInstruction);
    if (!match) {
      return node;
    }
    let [ , preLabel = '', label = '', postLabel = '', op, rest = '' ] = match;

    if (preLabel) {
      const preLabelEl = wrap(preLabel);
      node.append(preLabelEl);
      setSelection(index, preLabel.length, preLabelEl);
      index += preLabel.length;
    }
    if (label) {
      const labelEl = wrapLabel(label);
      const delEl = wrap(':');
      node.append(labelEl, delEl);
      setSelection(index, label.length, labelEl.firstChild);
      index += label.length;
      setSelection(index, 1, delEl);
      index += 1;
    }
    if (postLabel) {
      const postLabelEl = wrap(postLabel);
      node.append(postLabelEl);
      setSelection(index, postLabel.length, postLabelEl);
      index += preLabel.length;
    }

    let opEl = wrapOp(op);

    // Error on op-code
    if (displayError && instruction.errorIndex === 1) {
      opEl = wrapError(opEl);
      setSelection(index, op.length, opEl.firstChild);
      index += op.length;
    }

    node.append(opEl);

    match = rest.match(matchComment);
    let comment;
    [ rest = '', comment = '' ] = match;

    const operands = [ ...rest.matchAll(matchOperands) ];

    let operandIndex = 2;
    for (const [ , delimiter, operand ] of operands) {
      const delEl = wrap(delimiter);
      setSelection(index, delimiter.length, delEl.firstChild);
      index += delimiter.length;
      let operandEl = matchVar.test(operand) ? wrapVar(operand) : wrapConst(operand);
      setSelection(index, operand.length, operandEl.firstChild);
      index += operand.length;
      if (displayError && instruction.errorIndex === operandIndex) {
        operandEl = wrapError(operandEl);
      }
      node.append(delEl, operandEl);
      ++operandIndex;
    }

    // Error on full line
    if (instruction.errorIndex === 0) {
      node = wrapError(node);
    }

    return node;
  }
}
