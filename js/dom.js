export function createElement(tag = 'div', options = {}) {
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

export function isElementOrContains(el, testEl) {
  return el === testEl || el.contains(testEl);
}

export function isElementOrTextChild(el, testEl) {
  return el === testEl || el === testEl.parentNode && testEl.nodeType === Node.TEXT_NODE;
}

const EXCLUDED_TRAVERSAL_TAGS = [ 'style', 'script', 'noscript', 'iframe', 'object' ];
const BLOCK_DISPLAYS = [ 'block', 'list-item' ];

/**
 * Get text-only interpretation of element node tree with current selection offsets (with correct line endings for contenteditable)
 * @param {HTMLElement|Node} el Element to inspect/traverse
 * @return {{ text: string, selectionStart: number|null, selectionEnd: number|null }}
 */
export function getTextAndSelection(el) {
  const selection = getSelection();
  const range = selection.rangeCount ? getSelection().getRangeAt(0) : {};
  let { endContainer, endOffset, startContainer, startOffset } = range;
  let result = { text: '', selectionStart: null, selectionEnd: null };
  let texts = [];

  /**
   * @param {HTMLElement|Node} el Element to inspect/traverse
   * @param {number} index Current index withing result text string; how many characters before current position
   * @param {boolean} hasInlinePrevious Whether previous sibling is inline, causing a newline before el if displays block
   * @return {[ number, boolean ]} Count of new characters added and whether el ends in a newline or displays block
   */
  function traverse(el, index = 0, hasInlinePrevious = false) {
    const tagName = el.tagName?.toLowerCase();
    const isStartContainer = isElementOrTextChild(startContainer, el);
    const isEndContainer = isElementOrTextChild(endContainer, el);
    let charCount = 0, isBlock = false;

    if (tagName === 'br') {

      // If BR is within a block element, it could be ignored, so we'll defer to the caller
      isBlock = true;

    } else if (el.nodeType === Node.TEXT_NODE) {

      // Add text if there is any
      if (el.nodeValue) {
        texts.push(el.nodeValue);
        charCount = el.nodeValue.length;
      }

      // Set selection offsets if this is the container
      if (isStartContainer) {
        result.selectionStart = index + startOffset;
      }
      if (isEndContainer) {
        result.selectionEnd = index + endOffset;
      }

    } else if ((el.nodeType === Node.ELEMENT_NODE || el.nodeType === Node.DOCUMENT_NODE)
      && !EXCLUDED_TRAVERSAL_TAGS.includes(tagName)
    ) {

      // Add newline before a block element with previous inline sibling
      const styles = window.getComputedStyle(el);
      isBlock = BLOCK_DISPLAYS.includes(styles.getPropertyValue('display'));
      if (hasInlinePrevious && isBlock) {
        texts.push('\n');
        ++charCount;
      }

      const last = el.childNodes.length - 1;
      let isLastChildBlock = true;
      let childCharCount;
      for (let i = 0; ; ++i) {

        // Set selection offsets based on child content if this is the container
        if (isStartContainer && i === startOffset) {
          result.selectionStart = index + charCount;
        }
        if (isEndContainer && i === endOffset) {
          result.selectionEnd = index + charCount;
        }

        // Looped through one extra time to process selection above
        if (i > last) {
          break;
        }

        // Traverse each child node tree
        const node = el.childNodes[i];
        [ childCharCount, isLastChildBlock ] = traverse(node, index + charCount, !isLastChildBlock);
        charCount += childCharCount;

        // If child was block, add delimiting newline unless last child, then delegate to caller
        if (isLastChildBlock) {
          if (i !== last) {
            texts.push('\n');
            ++charCount;
          } else {
            isBlock = true;
          }
        }

      }

    }

    // Report to caller count of characters added and whether to add implied newline
    return [ charCount, isBlock ];
  }

  traverse(el);
  result.text = texts.join('');

  return result;
}
