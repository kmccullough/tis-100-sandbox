const formatNoop = () => {};
const formatCode = (el, codeAstRenderer) => codeAst => {
  el.innerHTML = codeAstRenderer.render(codeAst);
};
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

class CodeNodeRenderer {
  renderState;

  constructor(renderState, codeAstRenderer) {
    this.renderState = renderState;
    this.codeAstRenderer = codeAstRenderer;
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
    const acc = createElement({
      class: 'node-value',
      innerText: '0',
    });
    const accLabel = createElement({
      class: 'node-acc',
      innerHTML: '<span class="node-label">ACC</span><br>',
      append: acc,
    });
    const bak = createElement({
      class: 'node-value',
      innerText: '(0)',
    });
    const bakLabel = createElement({
      class: 'node-bak',
      innerHTML: '<span class="node-label">BAK</span><br>',
      append: bak,
    });
    const last = createElement({
      class: 'node-value',
      innerText: 'N/A',
    });
    const lastLabel = createElement({
      class: 'node-last',
      innerHTML: '<span class="node-label">LAST</span><br>',
      append: last,
    });
    const mode = createElement({
      class: 'node-value',
      innerText: 'IDLE',
    });
    const modeLabel = createElement({
      class: 'node-mode',
      innerHTML: '<span class="node-label">MODE</span><br>',
      append: mode,
    });
    const idle = createElement({
      class: 'node-value',
      innerText: '0%',
    });
    const idleLabel = createElement({
      class: 'node-idle',
      innerHTML: '<span class="node-label">IDLE</span><br>',
      append: idle,
    });
    const node = createElement({
      class: 'node',
    });
    node.append(code, accLabel, bakLabel, lastLabel, modeLabel, idleLabel);
    codeNode.elements = {
      node:   { element: node,   setValue: formatNoop         },
      code:   { element: editor, setValue: formatCode(editor, this.codeAstRenderer) },
      acc:    { element: acc,    setValue: formatNumber(acc)  },
      bak:    { element: bak,    setValue: formatBak(bak)     },
      last:   { element: last,   setValue: formatNumber(last) },
      mode:   { element: mode,   setValue: formatMode(mode)   },
      idle:   { element: idle,   setValue: formatPercent(idle)},
    };
  }

  setValue(codeNode, key, value) {
    this.createElements(codeNode);
    codeNode.elements[key]?.setValue?.(value);
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
