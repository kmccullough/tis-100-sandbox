import { debounce } from './async.js';
import { getTextAndSelection } from './dom.js';
import { UndoStack } from './undo-stack.js';

const IS_MAC = navigator.platform.toLowerCase().includes('mac');
const META_KEY = IS_MAC ? 'metaKey' : 'ctrlKey';
const IGNORE_KEYS = [
  'alt', 'control', 'shift',
  'home', 'end', 'pageup', 'pagedown',
  'arrowup', 'arrowright', 'arrowdown', 'arrowleft',
];

export class CodeNode {
  elements;
  position;
  renderer;
  undoStack = new UndoStack();

  constructor(renderer) {
    this._rerenderLater = this._rerenderLater.bind(this);
    this.setRenderer(renderer);
    this.render();
  }

  setRenderer(renderer) {
    this.renderer = renderer;
    return this.render();
  }

  setPosition(position) {
    this.position = position;
    return this.render();
  }

  setValue(key, value, addUndo = true) {
    if (key === 'code') {
      this.codeInstructions = value;
      if (addUndo) {
        this._addUndoItem();
      }
    }
    this.renderer?.setValue(this, key, value);
    return this;
  }

  _addUndoItem() {
    const { source, selectionStart, selectionEnd } = this.codeInstructions;
    this.undoStack.add({ source, selectionStart, selectionEnd });
  }

  render() {
    this.renderer?.render(this);
    return this;
  }

  rerenderLater() {
    if (!this.codeInstructions) {
      return;
    }
    this._rerenderTracking = debounce(this._rerenderLater, this._rerenderTracking);
  }

  rerenderFromUndoStack() {
    const { source, selectionStart } = this.undoStack.current;
    this._renderSource(source, selectionStart, selectionStart, false);
  }

  _rerenderLater() {
    const sourceEl = this.renderer?.getElement(this, 'code');
    const { text, selectionStart } = getTextAndSelection(sourceEl);
    this._renderSource(text, selectionStart, selectionStart);
  }

  _renderSource(source, selectionStart, selectionEnd, addUndo = true) {
    if (!this.codeInstructions) {
      return;
    }
    this.codeInstructions
      .setSelectionRange(selectionStart, selectionStart)
      .setSource(source)
    ;
    this.setValue('code', this.codeInstructions, addUndo);
  }

  onCut(e) {
    e.preventDefault();
    const selection = document.getSelection();
    e.clipboardData.setData('text/plain', selection.toString());
    document.execCommand('delete', false);
    // selection.deleteFromDocument();
    // this.rerenderCode(); // Called from onKeyPress
  }

  onPaste(e) {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    document.execCommand('insertText', false, pastedText);
    // this.rerenderCode(); // Called from onKeyPress
  }

  onKeyDown(e) {
    const key = e.key.toLowerCase();
    if (IGNORE_KEYS.includes(key)) {
      return;
    }
    // TODO move items to and from an artificial undo stack
    if (e[META_KEY] && !e.altKey) {
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undoStack.undo();
        this.rerenderFromUndoStack();
        return;
      } else if (key === 'y' && !e.shiftKey
        || key === 'z' && e.shiftKey
      ) {
        e.preventDefault();
        this.undoStack.redo();
        this.rerenderFromUndoStack();
        return;
      }
    }
    this.rerenderLater();
  }
}
