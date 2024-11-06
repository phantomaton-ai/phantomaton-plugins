import sigilium from 'sigilium';

const merge = base => {
  const sigil = sigilium.sigil(`${base.name}:merge`);
  const original = base.resolver();
  
  base.resolver = () => ({
    ...original,
    dependencies: [...original.dependencies, sigil.resolve],
    factory: (impls, decorators = [], [merger]) => {
      const result = merger ? merger(impls) : impls[0];
      return decorators ? decorators.reduce((fn, decorate) => decorate(fn), result) : result;
    }
  });

  base.merge = sigil;
  return base;
};

export default merge;