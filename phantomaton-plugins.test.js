import { expect, stub } from 'lovecraft';

import hierophant from 'hierophant';

import plugins from './phantomaton-plugins.js';

const { create, define } = plugins;

describe('phantomaton-plugins', () => {
  describe('create', () => {
    it('creates plugins which can be wired together by hierophant', () => {
      const a = create({
        foo: plugins.singleton,
        bar: plugins.composite
      });
      const b = create([
        define(a.bar).with(a.foo).as(foo => `Okay ${foo}`)
      ]);
      const c = create(({ baz }) => ({
        baz: baz.toUpperCase()
      }), ({ instance }) => [
        define(a.foo).as(instance.baz)
      ]);

      const container = hierophant();
      a().install.forEach(component => container.install(component));
      b().install.forEach(component => container.install(component));
      c({ baz: 'baz' }).install.forEach(component => container.install(component));

      expect(container.resolve(a.bar.resolve)).to.equal('Okay BAZ');
    });
  });
});
