import expose from './expose.js';

const create = (components, instantiate, install) => {
  const extensions = expose(components);
  const plugin = configuration => {
    const instance = instantiate(configuration);
    return {
      install: [
        ...Object.values(extensions).map(extension => extension.resolver()),
        ...install({ configuration, extensions, instance })
      ],
      instance
    };
  };
  Object.keys(extensions).forEach(key => {
    plugin[key] = extensions[key];
  });
  return plugin;
};

export default create;