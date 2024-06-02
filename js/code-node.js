class CodeNode {
  elements;
  position;
  renderer;

  constructor(renderer) {
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

  setValue(key, value) {
    this.renderer?.setValue(this, key, value);
    return this;
  }

  render() {
    this.renderer?.render(this);
    return this;
  }
}
