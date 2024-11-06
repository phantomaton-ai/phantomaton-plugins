import sigilium from 'sigilium';

const composite = (name) => sigilium.composite(name);

const singleton = (name) => sigilium.singleton(name);

const decorable = (base) => {
  const wrapped = base;
  wrapped.decorator = Symbol(`${wrapped.name}:decorator`);
  
  const originalResolver = wrapped.resolver;
  wrapped.resolver = () => ({
    ...originalResolver(),
    dependencies: [...originalResolver().dependencies, wrapped.decorator],
    factory: (impls, decorators = []) => {
      const base = originalResolver().factory(impls);
      return decorators.reduce((fn, decorate) => decorate(fn), base);
    }
  });

  return wrapped;
};

const aggregate = (base) => {
  const wrapped = base;
  wrapped.aggregate = Symbol(`${wrapped.name}:aggregate`);
  
  const originalResolver = wrapped.resolver;
  wrapped.resolver = () => ({
    ...originalResolver(),
    dependencies: [...originalResolver().dependencies, wrapped.aggregate],
    factory: (impls, decorators = [], [aggregator]) => {
      const result = aggregator ? aggregator(impls) : impls[0];
      return decorators ? decorators.reduce((fn, decorate) => decorate(fn), result) : result;
    }
  });

  return wrapped;
};

export { composite, singleton, decorable, aggregate };