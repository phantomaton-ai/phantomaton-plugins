import Registration from './registration.js';

class Decoration extends Registration {
  registration(dependencies, factory) {
    return this.extension.decorator(dependencies, factory);
  }
}

const decorate = extension => new Decoration(extension);

export default decorate;
