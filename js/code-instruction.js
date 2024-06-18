const ARGUMENT = {
  REGISTER: 1,
  INTEGER: 2,
  LABEL: 4,
};

const REGISTER = {
  ACC: {

  },
  BAK: {

  },
  UP: {

  },
  RIGHT: {

  },
  DOWN: {

  },
  LEFT: {

  },
};

const INSTRUCTION = {
  NOP: {
    params: [],
    execute() {},
  },
  MOV: {
    params: [ ARGUMENT.REGISTER | ARGUMENT.INTEGER, ARGUMENT.REGISTER ],
    execute() {

    },
  },
  SAV: {
    params: [],
    execute() {

    },
  },
  SWP: {
    params: [],
    execute() {

    },
  },
  ADD: {
    params: [ ARGUMENT.REGISTER | ARGUMENT.INTEGER ],
    execute() {

    },
  },
  SUB: {
    params: [ ARGUMENT.REGISTER | ARGUMENT.INTEGER ],
    execute() {

    },
  },
  NEG: {
    params: [],
    execute() {

    },
  },
  JMP: {
    params: [ ARGUMENT.LABEL ],
    execute() {

    },
  },
  JEZ: {
    params: [ ARGUMENT.LABEL ],
    execute() {

    },
  },
  JNZ: {
    params: [ ARGUMENT.LABEL ],
    execute() {

    },
  },
  JGZ: {
    params: [ ARGUMENT.LABEL ],
    execute() {

    },
  },
  JLZ: {
    params: [ ARGUMENT.LABEL ],
    execute() {

    },
  },
  JRO: {
    params: [ ARGUMENT.REGISTER | ARGUMENT.INTEGER ],
    execute() {

    },
  },
};

const matchLabel = /^([a-z0-9]+):(.*)/i;
const matchInteger = /^([0-9]+)$/;

export class CodeInstruction {
  lineNumber;
  source;
  selectionStart = null;
  selectionEnd = null;

  _process = false;
  _error;
  _errorIndex;
  _label;
  _instruction;
  _operands;

  constructor(lineNumber, source, selectionStart = null, selectionEnd = null) {
    this.setLineNumber(lineNumber);
    this.setSelectionRange(selectionStart, selectionEnd);
    this.setSource(source);
  }

  setLineNumber(lineNumber) {
    this._process = true;
    this.lineNumber = lineNumber;
    return this;
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
    this._label = null;
    this._error = null;
    this._errorIndex = null;
    let [ instruction, ...operands ] = String(this.source || '').trim().toUpperCase().split(/\s+|,/);
    const label = instruction.match(matchLabel);
    if (label) {
      this._label = label[1];
      instruction = label[2].trim() || operands.shift();
    }
    this._instruction = instruction;
    const op = INSTRUCTION[instruction];
    const { params } = op || {};

    if (instruction) {
      if (!op) {
        this._error = `INVALID OPCODE "${instruction}"`;
        this._errorIndex = 1;
      }
      if (!this._error && params) {
        if (operands.length < params.length) {
          this._error = 'MISSING OPERAND';
          this._errorIndex = 0;
        } else if (operands.length > params.length) {
          this._error = 'TOO MANY OPERANDS';
          const index = operands.length + 2;
          this._errorIndex = [ index - params.length, index ];
        } else if (params.length) {
          const register = REGISTER[operands[0]];
          const isInteger = matchInteger.test(operands[0]);
          const RI = ARGUMENT.REGISTER | ARGUMENT.INTEGER;
          if (params[0] & RI === RI && !(register || isInteger)) {
            this._error = `INVALID EXPRESSION "${operands[0]}"`;
            this._errorIndex = 2;
          } else if (params.length >= 2) {
            const register = REGISTER[operands[1]];
            if (params[1] & ARGUMENT.REGISTER && !register) {
              this._error = `INVALID REGISTER "${operands[1]}"`;
              this._errorIndex = 3;
            }
          }
        }
      }
    }
    // TODO add `UNDEFINED LABEL`
    this._operands = operands;
  }

  get error() {
    this.processSource();
    return this._error;
  }

  get errorIndex() {
    this.processSource();
    return this._errorIndex;
  }

  get label() {
    this.processSource();
    return this._operands;
  }

  get instruction() {
    this.processSource();
    return this._instruction;
  }

  get operands() {
    this.processSource();
    return this._operands;
  }
}
