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

class CodeInstruction {
  lineNumber;
  source;
  label;
  instruction;
  operands;
  error;
  errorIndex;

  constructor(lineNumber, source) {
    this.setLineNumber(source);
    this.setSource(source);
  }

  setLineNumber(lineNumber) {
    this.lineNumber = lineNumber;
    return this;
  }

  setSource(source) {
    this.source = source;
    this.processSource();
    return this;
  }

  processSource() {
    this.label = null;
    this.error = null;
    this.errorIndex = null;
    let [ instruction, ...operands ] = String(this.source || '').trim().split(/\s+|,/);
    const label = instruction.match(matchLabel);
    if (label) {
      this.label = label[1];
      instruction = label[2].trim() || operands.shift();
    }
    this.instruction = instruction;
    const opCode = instruction.toUpperCase();
    const op = INSTRUCTION[opCode];
    const { params } = op || {};
    if (!op) {
      this.error = `INVALID OPCODE "${opCode}"`;
      this.errorIndex = 1;
    }
    if (!this.error && params) {
      if (operands.length < params.length) {
        this.error = 'MISSING OPERAND';
        this.errorIndex = 0;
      } else if (operands.length > params.length) {
        this.error = 'TOO MANY OPERANDS';
        const index = operands.length + 2;
        this.errorIndex = [ index - params.length, index ];
      } else if (params.length) {
        const register = REGISTER[operands[0]];
        const isInteger = matchInteger.test(operands[0]);
        const RI = ARGUMENT.REGISTER | ARGUMENT.INTEGER;
        if (params[0] & RI === RI && !(register || isInteger)) {
          this.error = `INVALID EXPRESSION "${operands[0]}"`;
          this.errorIndex = 2;
        } else if (params.length >= 2) {
          const register = REGISTER[operands[1]];
          if (params[1] & ARGUMENT.REGISTER && !register) {
            this.error = `INVALID REGISTER "${operands[1]}"`;
            this.errorIndex = 3;
          }
        }
      }
    }
    this.operands = operands;
  }
}
