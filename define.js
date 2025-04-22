import Registration from './registration.js';

class Definition extends Registration {
  registration(dependencies, factory) {
    return this.extension.provider(dependencies, factory);
  }
}

const define = extension => new Definition(extension);

export default define;
