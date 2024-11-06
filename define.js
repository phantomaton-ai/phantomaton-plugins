class Definition {
  constructor(extension, dependencies = []) {
    this.extension = extension;
    this.dependencies = dependencies;
  }

  with(...dependencies) {
    return new Definition(this.hieroglyph, [...this.dependencies, dependencies]);
  }

  as(value) {
    return this.extension.provider(this.dependencies, value);
  }
}

const define = hieroglyph => new Definition(hieroglyph);

export default define;
