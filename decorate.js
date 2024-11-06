import sigilium from 'sigilium';

const decorate = base => {
  const sigil = sigilium.sigil(`${base.name}:decorate`);
  const original = base.resolver();
  
  base.resolver = () => ({
    ...original,
    dependencies: [...original.dependencies, sigil.resolve],
    factory: (impls, decorators = []) => {
      const result = original.factory(impls);
      return decorators.reduce((fn, decorate) => decorate(fn), result);
    }
  });

  base.decorate = sigil;
  return base;
};

export default decorate;