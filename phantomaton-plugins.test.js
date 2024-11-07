import lovecraft from 'lovecraft';
import plugins from './phantomaton-plugins.js';

const { expect, stub } = lovecraft;

describe('phantomaton-plugins', () => {
  describe('plugins.create', () => {
    it('handles simple component arrays', () => {
      const extension = plugins.single('test');
      const component = extension.provider([], () => 'test');
      const plugin = plugins.create([component]);
      
      expect(plugin).to.be.a('function');
      const installed = plugin({});
      expect(installed).to.have.property('install').that.is.an('array');
      expect(installed.install).to.deep.include(component);
    });

    it('supports extension point declarations', () => {
      const plugin = plugins.create({
        test: plugins.single,
        multi: plugins.compose
      });

      expect(plugin).to.be.a('function');
      const installed = plugin({});
      expect(installed).to.have.property('install').that.is.an('array');
      // Should include resolvers for declared extension points
      expect(installed.install.some(
        component => component.symbol.description.includes('test:resolve')
      )).to.be.true;
      expect(installed.install.some(
        component => component.symbol.description.includes('multi:resolve')
      )).to.be.true;
    });

    it('supports instance creation', () => {
      const instance = { test: true };
      const plugin = plugins.create(instance, plugin => [{
        symbol: Symbol('test'),
        dependencies: [],
        factory: () => plugin.instance.test
      }]);

      expect(plugin).to.be.a('function');
      const installed = plugin({});
      expect(installed).to.have.property('install').that.is.an('array');
      expect(installed.install[0].factory()).to.equal(true);
    });

    it('provides configuration to components', () => {
      const plugin = plugins.create(plugin => [{
        symbol: Symbol('test'),
        dependencies: [],
        factory: () => plugin.configuration.value
      }]);

      expect(plugin).to.be.a('function');
      const installed = plugin({ value: 'test' });
      expect(installed).to.have.property('install').that.is.an('array');
      expect(installed.install[0].factory()).to.equal('test');
    });
  });

  describe('plugins.define', () => {
    it('creates component definitions', () => {
      const extension = plugins.single('test');
      const component = plugins.define(extension).as(() => 'test');
      
      expect(component).to.have.property('symbol', extension.impl);
      expect(component.dependencies).to.be.an('array').that.is.empty;
      expect(component.factory()).to.equal('test');
    });

    it('supports dependency injection', () => {
      const extension = plugins.single('test');
      const dep = plugins.single('dep');
      const component = plugins.define(extension)
        .with(dep.resolve)
        .as(value => () => value);
      
      expect(component).to.have.property('symbol', extension.impl);
      expect(component.dependencies).to.deep.equal([dep.resolve]);
      expect(component.factory('test')()).to.equal('test');
    });
  });

  describe('extension points', () => {
    it('supports single implementations', () => {
      const extension = plugins.single('test');
      const resolver = extension.resolver();
      
      expect(resolver.factory(['test'])).to.equal('test');
      expect(() => resolver.factory(['test', 'extra']))
        .to.throw(/exactly one implementation/);
    });

    it('supports composite implementations', () => {
      const extension = plugins.compose('test');
      const resolver = extension.resolver();
      
      expect(resolver.factory(['test', 'extra'])).to.equal('test');
      expect(resolver.factory([])).to.be.undefined;
    });
  });
});