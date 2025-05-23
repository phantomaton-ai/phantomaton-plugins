import { expect, stub } from 'lovecraft';

import hierophant from 'hierophant';

import plugins from './phantomaton-plugins.js';

const { create, decorate, define } = plugins;

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

      expect(container.resolve(a.foo.resolve)).to.deep.equal(['BAZ']);
      expect(container.resolve(a.bar.resolve)).to.deep.equal(['Okay BAZ']);
    });

    it('supports decoration', () => {
      const base = create({ greet: plugins.composite });
      const impl = create([
        define(base.greet).as(() => 'Hello')
      ]);
      const deco = create([
        decorate(base.greet).as(fn => () => `${fn()}, there`)
      ]);

      const container = hierophant();
      base().install.forEach(component => container.install(component));
      impl().install.forEach(component => container.install(component));
      deco().install.forEach(component => container.install(component));

      const [greet] = container.resolve(base.greet.resolve);
      expect(greet()).to.equal('Hello, there');
    });

    it('supports application entry points with input handling', () => {
      const app = create({
        message: plugins.optional
      });
      
      const io = create([
        define(plugins.input).as('hello'),
        define(app.message).with(plugins.input).as(input => input.toUpperCase())
      ]);

      const main = create([
        define(plugins.start).with(app.message).as(message => () => message)
      ]);

      const container = hierophant();
      app().install.forEach(component => container.install(component));
      io().install.forEach(component => container.install(component));
      main().install.forEach(component => container.install(component));

      container.install(plugins.input.resolver());
      container.install(plugins.start.resolver());

      const [start] = container.resolve(plugins.start.resolve);
      expect(start()).to.equal('HELLO');
    });
  });
});