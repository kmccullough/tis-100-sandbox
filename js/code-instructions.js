import { CodeInstruction } from './code-instruction.js';

export class CodeInstructions {
  source;
  selectionStart = null;
  selectionEnd = null;

  _process = false;
  _instructions;

  constructor(source) {
    this.setSource(source);
  }

  setSelectionRange(start = null, end = null) {
    this._process = true;
    this.selectionStart = start;
    this.selectionEnd = end;
    return this;
  }

  setSource(source) {
    this._process = true;
    this.source = source;
    return this;
  }

  processSource() {
    if (!this._process) {
      return;
    }
    this._process = false;
    const instructions = this._instructions = [];
    const lines = String(this.source || '').split('\n');
    let count = 0;
    const { selectionStart = null, selectionEnd = null } = this;
    for (let i = 0; i < lines.length; ++i) {
      const length = lines[i].length;
      const newCount = count + length + 1;
      let start = null, end = null;
      if (selectionStart !== null) {
        if (selectionStart >= count && selectionStart < newCount) {
          start = selectionStart - count;
        }
        if (selectionEnd >= count && selectionEnd < newCount) {
          end = selectionEnd - count;
        }
      }
      instructions[i] = new CodeInstruction(i + 1, lines[i], start, end);
      count = newCount;
    }
  }

  get instructions() {
    if (this._process) {
      this.processSource();
    }
    return this._instructions;
  }
}
