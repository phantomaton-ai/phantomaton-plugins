class Decoration {
  constructor(extension, dependencies = []) {
    this.extension = extension;
    this.dependencies = dependencies;
  }

  with(...dependencies) {
    return new Decoration(this.extension, [...this.dependencies, ...dependencies]);
  }

  as(value) {
    return this.extension.decorator(
      this.dependencies.map(({ resolve }) => resolve),
      this.dependencies.length < 1 ?
        () => value :
        (...arrays) => value(...arrays.map(([head]) => head))
    );
  }
}

const decorate = extension => new Decoration(extension);

export default decorate;
