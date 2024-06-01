addEventListener('DOMContentLoaded', () => {
  const code = createEl({
    class: 'node-code',
    innerHTML: 'MOV UP DOWN',
  });
  const acc = createEl({
    class: 'node-acc',
    innerHTML: '<span class="node-label">ACC</span><br>0',
  });
  const bak = createEl({
    class: 'node-bak',
    innerHTML: '<span class="node-label">BAK</span><br>(0)',
  });
  const last = createEl({
    class: 'node-last',
    innerHTML: '<span class="node-label">LAST</span><br>N/A',
  });
  const mode = createEl({
    class: 'node-mode',
    innerHTML: '<span class="node-label">MODE</span><br>IDLE',
  });
  const idle = createEl({
    class: 'node-idle',
    innerHTML: '<span class="node-label">IDLE</span><br>0%',
  });
  const node = createEl({
    class: 'node',
  });
  node.append(code, acc, bak, last, mode, idle);
  document.body.append(node);
});

function createEl(tag = 'div', options = {}) {
  if (tag && typeof tag !== 'string') {
    options = tag;
    tag = 'div';
  }
  options ||= {};
  const el = document.createElement(tag);
  createEl.propertyOptions ??= [
    'dataset',
    'innerHTML',
    'innerText',
  ];
  for (const option of createEl.propertyOptions) {
    if (options[option]) {
      el[option] = options[option];
    }
  }
  if (options.class) {
    el.classList.add(...options.class.trim().split(/\s+/));
  }
  return el;
}
