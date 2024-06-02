const nodes = [];
const renderState = new RenderState();
const codeNodeRenderer = new CodeNodeRenderer(renderState);

addEventListener('DOMContentLoaded', () => {
  const codeNode = new CodeNode(codeNodeRenderer)
    .setPosition({ x: 0, y: 0 })
  ;
  let toggle = 0;
  setInterval(() => {
    toggle = toggle ? 0 : 1
    codeNode.setValue('code', toggle ? 'MOV UP DOWN' : 'MOV LEFT RIGHT');
    codeNode.setValue('acc', toggle);
    codeNode.setValue('bak', toggle);
    codeNode.setValue('last', toggle);
    codeNode.setValue('mode', toggle);
    codeNode.setValue('idle', toggle);
  }, 1000);
});
