import { createElement } from './dom.js';

const formatNoop = () => {};
const formatCode = (el, codeInstructionsRenderer) => codeAst => {
  let {
    nodes, startContainer, startOffset, endContainer, endOffset
  } = codeInstructionsRenderer.render(codeAst);

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
    const editor = createElement({
      class: 'node-editor',
      attributes: {
        contenteditable: true,
        autocomplete: 'off',
        autocapitalize: 'off',
        spellcheck: false,
      },
    });
    const code = createElement({
      class: 'node-code',
      append: editor,
    });
    code.addEventListener('cut', e => codeNode?.onCut?.(e));
    code.addEventListener('paste', e => codeNode?.onPaste?.(e));
    code.addEventListener('keydown', e => codeNode?.onKeyDown?.(e));
    code.addEventListener('keypress', e => codeNode?.onKeyPress?.(e));
    code.addEventListener('keyup', e => codeNode?.onKeyUp?.(e));
    code.addEventListener('input', e => codeNode?.onInput?.(e));
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
        element: editor,
        getValue: getCodeFromFormatted(editor, this.codeInstructionsRenderer),
        setValue: formatCode(editor, this.codeInstructionsRenderer),
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
