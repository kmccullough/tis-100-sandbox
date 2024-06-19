import { CodeInstructions } from './code-instructions.js';
import { CodeInstructionsRenderer } from './code-instructions-renderer.js';
import { CodeNode } from './code-node.js';
import { CodeNodeRenderer } from './code-node-renderer.js';
import { RenderState } from './render-state.js';

const renderState = new RenderState();
const codeInstructionsRenderer = new CodeInstructionsRenderer(renderState);
const codeNodeRenderer = new CodeNodeRenderer(renderState,  codeInstructionsRenderer);

addEventListener('DOMContentLoaded', () => {
  const instructions = new CodeInstructions('MOV UP DOWN1 # COMMENT\nLABEL: MOV 123 ACC');
  const codeNode = new CodeNode(codeNodeRenderer)
    .setPosition({ x: 0, y: 0 })
    .setValue('code', instructions)
  ;
  let toggle = 0;
  setInterval(() => {
    toggle = toggle ? 0 : 1
    codeNode.setValue('acc', toggle);
    codeNode.setValue('bak', toggle);
    codeNode.setValue('last', toggle);
    codeNode.setValue('mode', toggle);
    codeNode.setValue('idle', toggle);
  }, 1000);
});
