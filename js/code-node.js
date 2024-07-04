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
    const selection = document.getSelection();
    e.clipboardData.setData('text/plain', selection.toString());
    this.rerenderLater();
  }

  onPaste(e) {
    const text = e.clipboardData.getData('text');
    console.log('TODO: add paste', text);
    this.rerenderLater();
  }

  onDrop(e) {
    const text = e.dataTransfer.getData('text');
    console.log('TODO: add drop', text);
    this.rerenderLater();
  }

  onKeyDown(e) {
    const key = e.key.toLowerCase();
    if (key === 'enter') {
      console.log('TODO handle newline');
      return;
    }
    if (key === 'backspace') {
      console.log('TODO handle backspace');
      return;
    }
    if (key === 'delete') {
      console.log('TODO handle delete');
      return;
    }
    if (key === 'home') {
      console.log('TODO handle home');
      return;
    }
    if (key === 'end') {
      console.log('TODO handle end');
      return;
    }
    if (key === 'pageup') {
      console.log('TODO handle pageup');
      return;
    }
    if (key === 'pagedown') {
      console.log('TODO handle pagedown');
      return;
    }
    if (IGNORE_KEYS.includes(key)) {
      return;
    }
    if (e[META_KEY] && !e.altKey) {
      const isUndo = key === 'z' && !e.shiftKey;
      const isRedo = key === 'y' && !e.shiftKey || key === 'z' && e.shiftKey;
      if (isUndo || isRedo) {
        console.log(isUndo ? 'undo' : 'redo');
        if (isUndo) {
          this.undoStack.undo();
        } else {
          this.undoStack.redo();
        }
        e.preventDefault();
        this.rerenderFromUndoStack();
        return;
      }
    }
    console.log('keydown', `[${key}]`);
    // this.rerenderLater();
  }

  onInput(e) {
    console.log('input');
    if (e.inputType === 'insertParagraph') {
      console.log('TODO: add paragraph');
      this.rerenderLater();
      return;
    }
    if (e.inputType === 'deleteContentBackward') {
      console.log('TODO: delete backwards');
      this.rerenderLater();
      return;
    }

    const key = e.data.toLowerCase();
    if (IGNORE_KEYS.includes(key)) {
      return;
    }
    this.rerenderLater();
  }
}
