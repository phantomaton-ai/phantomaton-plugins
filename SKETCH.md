# Phantomaton Plugins Sketch

## Goals

1. Provide a fluent, expressive API for defining and registering Phantomaton plugins.
2. Encapsulate the boilerplate of plugin creation, including configuration and extension point management.
3. Allow for declarative definition of extension points (e.g., `{ foo: plugins.composite, bar: plugins.singleton }`).
4. Minimize the need for manual naming of plugins.

## Proposed API

Here's how you might use this API:

```javascript
import conversations from 'phantomaton-conversations';
import plugins from 'phantomaton-plugins';

import start from './start.js';
import user from './user.js';

export default plugins.create([
  plugins.define(conversations.user).as(user),
  plugins.define(plugins.start).with(conversations.conversation).as(start)
]);
```

```
import conversations from 'phantomaton-conversations';
import plugins from 'phantomaton-plugins';
import system from 'phantomaton-system';

import assistant from './assistant.js';
import claude from './claude.js';

export default plugins.create(claude, plugin => [
  plugins.define(conversations.assistant).with(system.prompt).as(
    prompt => assistant(plugin.instance, prompt)
  )
]);
```

```
import plugins from 'phantomaton-plugins';

import conversation from './conversation.js';

export default plugins.create({
  user: plugins.composite,
  assistant: plugins.composite,
  conversation: plugins.decorable(plugins.singleton)
}, plugin => [
  plugins.define(plugin.extensions.conversation)
    .with(plugin.extensions.user, plugin.extensions.assitant)
    .as((user, assitant) => turns => plugin.conversation(user, assistant, turns));
]);
```

The key points are:

1. `plugins.create` is the main entry point, returning a function which takes a global configuration object and returns an installable plugin.
2. `plugins.composite` and `plugins.singleton` are used to define extension points, which are registered with the container.
3. The setup function for each plugin receives a local config object and returns the plugin implementation, which is then registered with the container.
4. No need to manually specify plugin names - they are derived from the extension point names.

Additionally:

* Arguments to `plugins.create` get traversed in order.
  * The first argument may be an object containing key-value pairs defining extension points that the plugin will expose. (This may be omitted if a plugin exposes no symbols.)
  * The next argument may be an instantiation function which accepts a configuration object and returns a concrete instance of the plugin's main `instance`. (This may be omitted if a plugin exposes no `instance`)
  * The final argument must be either an array of components, or a function which takes a `plugin` object and returns an array of components to be installed at various extension points. The `plugin` object provided on input will have the properties `configuration` (representing the configuration passed in to the plugin at installation time), `instance` (if an instantiation function is provided), and `extensions` (if any extension points are declared).

This approach provides a more concise and expressive way to define and register Phantomaton plugins, while still maintaining the flexibility and extensibility of the original plugin system.