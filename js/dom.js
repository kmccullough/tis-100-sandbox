function createElement(tag = 'div', options = {}) {
  if (tag && typeof tag !== 'string') {
    options = tag;
    tag = 'div';
  }
  options ||= {};
  const el = document.createElement(tag);
  createElement.propertyOptions ??= [
    'dataset',
    'innerHTML',
    'innerText',
  ];
  for (const option of createElement.propertyOptions) {
    if (option in options) {
      el[option] = options[option];
    }
  }
  for (const attr of Object.keys(options.attributes || {})) {
    if (attr in options.attributes) {
      el.setAttribute(attr, options.attributes[attr]);
    }
  }
  if (options.class) {
    el.classList.add(...options.class.trim().split(/\s+/));
  }
  createElement.attachOptions ??= [
    'prepend',
    'append',
  ];
  for (const attach of createElement.attachOptions) {
    if (attach in options) {
      el[attach](...[].concat(options[attach]));
    }
  }
  return el;
}
