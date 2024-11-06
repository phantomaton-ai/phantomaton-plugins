# Phantomaton Plugins Sketch

## Goals

1. Provide a fluent, expressive API for defining and registering Phantomaton plugins.
2. Encapsulate the boilerplate of plugin creation, including configuration and extension point management.
3. Allow for declarative definition of extension points (e.g., `{ foo: plugins.composite, bar: plugins.singleton }`).
4. Minimize the need for manual naming of plugins.

## Proposed API

```javascript
// phantomaton-plugins.js
import { createContainer } from 'phantomaton-core';

const plugins = {
  create: (config, setup) => {
    const container = createContainer();
    setup(container);
    return container.getPlugin();
  },

  composite: (name) => ({
    [name]: (config, setup) => container => {
      container.register({
        [name]: (config) => setup(config)
      });
    }
  }),

  singleton: (name) => ({
    [name]: (config, setup) => container => {
      container.register({
        [name]: Object.assign(setup(config), { instance: Symbol() })
      });
    }
  })
};

export default plugins;
```

Here's how you might use this API:

```javascript
// my-phantomaton-app.js
import plugins from 'phantomaton-plugins';

const app = plugins.create({ /* global config */ }, (container) => {
  container.register(
    plugins.composite('conversations')({
      /* conversations config */
    }, (config) => ({
      user: ...,
      assistant: ...,
      conversation: ...
    }))
  );

  container.register(
    plugins.singleton('anthropic')({
      /* anthropic config */
    }, (config) => ({
      converse: async (messages) => { ... }
    }))
  );

  container.register(
    plugins.composite('cli')({
      /* cli config */
    }, (config) => ({
      install: [...] 
    }))
  );
});
```

The key points are:

1. `plugins.create` is the main entry point, taking a global config object and a setup function that registers plugins.
2. `plugins.composite` and `plugins.singleton` are used to define extension points, which are registered with the container.
3. The setup function for each plugin receives a local config object and returns the plugin implementation, which is then registered with the container.
4. No need to manually specify plugin names - they are derived from the extension point names.
5. The container is passed to the setup function, allowing plugins to depend on each other's extension points.

This approach provides a more concise and expressive way to define and register Phantomaton plugins, while still maintaining the flexibility and extensibility of the original plugin system.