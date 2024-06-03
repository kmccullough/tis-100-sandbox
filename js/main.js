const nodes = [];
const renderState = new RenderState();
const codeAstRenderer = new CodeInstructionsRenderer(renderState);
const codeNodeRenderer = new CodeNodeRenderer(renderState,  codeAstRenderer);

addEventListener('DOMContentLoaded', () => {
  const codeAst = new CodeInstructions('MOV UP DOWN1\nLABEL:MOV DOWN UP');
  const codeNode = new CodeNode(codeNodeRenderer)
    .setPosition({ x: 0, y: 0 })
    .setValue('code', codeAst)
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
