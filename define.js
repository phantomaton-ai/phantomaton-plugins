class Definition {
  constructor(extension, dependencies = []) {
    this.extension = extension;
    this.dependencies = dependencies;
  }

  with(...dependencies) {
    return new Definition(this.extension, [...this.dependencies, dependencies]);
  }

  as(value) {
    return this.extension.provider(
      this.dependencies,
      (...arrays) => value(...arrays.map(array => array[0]))
    );
  }
}

const define = extension => new Definition(extension);

export default define;
