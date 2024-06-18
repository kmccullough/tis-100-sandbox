export class UndoStack {
  stack = [];
  stackPos;

  add(undoItem) {
    if (this.canRedo) {
      this.stack = this.stack.slice(0, this.stackPos);
    }
    this.stack.push(undoItem);
    this.stackPos = this.stack.length - 1;
  }

  get current() {
    return this.stack[this.stackPos] ?? null;
  }

  undo() {
    if (this.canUndo) {
      --this.stackPos;
    }
  }

  redo() {
    if (this.canRedo) {
      ++this.stackPos;
    }
  }

  get canUndo() {
    return !!this.stackPos;
  }

  get canRedo() {
    return (this.stackPos ?? this.stack.length) < this.stack.length - 1;
  }
}
