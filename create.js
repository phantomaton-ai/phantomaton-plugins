import expose from './expose.js';

const create = (components, instantiate, install) => {
  const extensions = expose(components);
  return configuration => {
    const instance = instantiate(configuration);
    return { install: install({ configuration, extensions, instance }) };
  };
};

export default create;