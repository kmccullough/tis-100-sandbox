import { CodeMirror, CodeMirrorJavaScript, CodeMirrorState } from '../dist/vendor.js';
const { EditorView, basicSetup } = CodeMirror;
const { EditorState } = CodeMirrorState;
const { javascript } = CodeMirrorJavaScript;

import { createElement } from './dom.js';

const MAX_CODE_LINES = 15;
const MAX_CODE_LINE = 18;

const formatNoop = () => {};
const formatCode = (el, codeInstructionsRenderer) => codeInstructions => {
  let {
    nodes, startContainer, startOffset, endContainer, endOffset
  } = codeInstructionsRenderer.render(codeInstructions);
return;
  for (const node of Array.from(el.childNodes)) {
    node.remove();
  }

  el.append(...nodes);

  if (startContainer) {
    let range = document.createRange();
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer || startContainer, endContainer ? endOffset : startOffset);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
};
const getCodeFromFormatted = el => () => el.innerText;
const formatNumber = el => value => {
  el.innerText = value;
};
const formatBak = el => value => {
  el.innerText = '(' + value + ')';
};
const formatMode = el => value => {
  el.innerText = value === 1 ? 'run'
    : value === 2 ? 'wrte'
    : value === 3 ? 'read'
    : 'idle';
};
const formatPercent = el => value => {
  el.innerText = Math.round(value * 100) + '%';
};

export class CodeNodeRenderer {
  renderState;

  constructor(renderState, codeInstructionsRenderer) {
    this.renderState = renderState;
    this.codeInstructionsRenderer = codeInstructionsRenderer;
  }

  createElements(codeNode) {
    if (codeNode.elements) {
      return;
    }
    const code = createElement({
      class: 'node-code',
    });
    const tis100 = EditorState.changeFilter.of(tr => {
      return !(tr.docChanged && (
        tr.newDoc.lines > MAX_CODE_LINES
        || tr.newDoc.text.some(t => t.length > MAX_CODE_LINE)
      ))
    });
    const startState = EditorState.create({
      doc: 'Hello World',
      extensions: [ tis100, basicSetup, javascript() ],
    })
    let view = new EditorView({
      state: startState,
      parent: code
    })
    code.addEventListener('cut', e => {
      e.preventDefault();
      codeNode?.onCut?.(e);
      document.getSelection()?.deleteFromDocument();
    });
    code.addEventListener('paste', e => {
      e.preventDefault();
      codeNode?.onPaste?.(e);
    });
    code.addEventListener('drop', e => {
      codeNode?.onDrop?.(e);
    });
    code.addEventListener('keydown', e => codeNode?.onKeyDown?.(e));
    code.addEventListener('keypress', e => codeNode?.onKeyPress?.(e));
    code.addEventListener('keyup', e => codeNode?.onKeyUp?.(e));
    code.addEventListener('beforeinput', e => {
      codeNode?.onBeforeInput?.(e);
    });
    code.addEventListener('input', e => {
      if (e.isComposing) {
        return;
      }
      e.preventDefault();
      codeNode?.onInput?.(e);
    });
    const acc = createElement({
      class: 'node-value',
      innerText: '0',
    });
    const accLabel = createElement({
      class: 'node-acc',
      innerHTML: '<span class="node-heading">ACC</span><br>',
      append: acc,
    });
    const bak = createElement({
      class: 'node-value',
      innerText: '(0)',
    });
    const bakLabel = createElement({
      class: 'node-bak',
      innerHTML: '<span class="node-heading">BAK</span><br>',
      append: bak,
    });
    const last = createElement({
      class: 'node-value',
      innerText: 'N/A',
    });
    const lastLabel = createElement({
      class: 'node-last',
      innerHTML: '<span class="node-heading">LAST</span><br>',
      append: last,
    });
    const mode = createElement({
      class: 'node-value',
      innerText: 'IDLE',
    });
    const modeLabel = createElement({
      class: 'node-mode',
      innerHTML: '<span class="node-heading">MODE</span><br>',
      append: mode,
    });
    const idle = createElement({
      class: 'node-value',
      innerText: '0%',
    });
    const idleLabel = createElement({
      class: 'node-idle',
      innerHTML: '<span class="node-heading">IDLE</span><br>',
      append: idle,
    });
    const node = createElement({
      class: 'node',
    });
    node.append(code, accLabel, bakLabel, lastLabel, modeLabel, idleLabel);
    codeNode.elements = {
      node:   { element: node,   setValue: formatNoop         },
      code:   {
        element: code,
        getValue: getCodeFromFormatted(code, this.codeInstructionsRenderer),
        setValue: formatCode(code, this.codeInstructionsRenderer),
      },
      acc:    { element: acc,    setValue: formatNumber(acc)  },
      bak:    { element: bak,    setValue: formatBak(bak)     },
      last:   { element: last,   setValue: formatNumber(last) },
      mode:   { element: mode,   setValue: formatMode(mode)   },
      idle:   { element: idle,   setValue: formatPercent(idle)},
    };
  }

  getValue(codeNode, key) {
    this.createElements(codeNode);
    return codeNode.elements[key]?.getValue?.();
  }

  setValue(codeNode, key, value) {
    this.createElements(codeNode);
    codeNode.elements[key]?.setValue?.(value);
  }

  getElement(codeNode, key) {
    return codeNode.elements[key]?.element;
  }

  render(codeNode) {
    if (!codeNode?.position) {
      return;
    }
    // TODO positioning

    this.createElements(codeNode);

    document.body.append(codeNode.elements.node.element);
  }
}
