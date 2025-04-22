export default class Registration {
  constructor(extension, dependencies = []) {
    this.extension = extension;
    this.dependencies = dependencies;
  }

  with(...dependencies) {
    return new this.constructor(this.extension, [...this.dependencies, ...dependencies]);
  }

  as(value) {
    return this.registration(
      this.dependencies.map(({ resolve }) => resolve),
      this.dependencies.length < 1 ?
        () => value :
        (...arrays) => value(...arrays.map(([head]) => head))
    );
  }
}