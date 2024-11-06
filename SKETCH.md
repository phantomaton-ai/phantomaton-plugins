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
  conversations.user(user),
  plugins.start(plugins.use(conversations.conversation).to(start))
]);
```

```
import conversations from 'phantomaton-conversations';
import plugins from 'phantomaton-plugins';
import system from 'phantomaton-system';

import assistant from './assistant.js';
import claude from './claude.js';

export default plugins.create(claude, instance => [
  conversations.assistant(
    plugins.use(system.prompt).to(prompt => assistant(instance, prompt))
  ),
  plugins.start(plugins.use(conversations.conversation).to(start))
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
  plugin.conversation(plugins.use(user, assitant).to(
    (user, assitant) => turns => plugin.conversation(user, assistant, turns)
  ))
]);
```

The key points are:

1. `plugins.create` is the main entry point, returning a function which takes a global configuration object and returns an installable plugin.
2. `plugins.composite` and `plugins.singleton` are used to define extension points, which are registered with the container.
3. The setup function for each plugin receives a local config object and returns the plugin implementation, which is then registered with the container.
4. No need to manually specify plugin names - they are derived from the extension point names.
5. The container is passed to the setup function, allowing plugins to depend on each other's extension points.

This approach provides a more concise and expressive way to define and register Phantomaton plugins, while still maintaining the flexibility and extensibility of the original plugin system.