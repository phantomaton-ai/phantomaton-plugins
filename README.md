# Phantomaton Plugins 🔌

A simplified and more expressive way to create plugins for the [Phantomaton](https://github.com/phantomaton-ai/phantomaton) AI framework.

## Installation 📦

```bash
npm install phantomaton-plugins
```

## Usage 🛠️

```javascript
import plugins from 'phantomaton-plugins';

// Create a plugin that exposes extension points
const api = plugins.create({
  message: plugins.singleton,
  effects: plugins.composite
});

// Create a plugin that provides implementations
const impl = plugins.create([
  plugins.define(api.message).as('Hello, world!'),
  plugins.define(api.effects).as(msg => console.log(msg))
]);
```

## Plugin Creation Patterns 🎭

The `plugins.create` function supports several argument patterns for flexibility:

### Extension Point Declaration

```javascript
// First argument can be an object mapping names to extension point types
const api = plugins.create({
  single: plugins.singleton,
  many: plugins.composite,
  maybe: plugins.optional
});
```

### Instance Creation

```javascript
// A function that takes config and returns an instance
const plugin = plugins.create(config => ({
  value: config.someValue
}));
```

### Component Installation

Components can be provided either as an array:
```javascript
// Static array of components to install
const plugin = plugins.create([
  plugins.define(other.extension).as(value)
]);
```

Or as a function that receives context:
```javascript
// Function receiving { configuration, extensions, instance }
const plugin = plugins.create(({ configuration }) => [
  plugins.define(other.extension).as(configuration.value)
]);
```

### Combining Patterns

These patterns can be combined, with arguments processed in order:
1. Extension point declarations (object)
2. Instance creator (function, if not last argument)
3. Component installer (array or function, must be last argument)

```javascript
const plugin = plugins.create(
  { api: plugins.singleton },      // Extension points
  config => ({ foo: config.foo }), // Instance creator
  ({ instance }) => [             // Component installer
    plugins.define(other.ext).as(instance.foo)
  ]
);
```

## Entry Points 🚪

The library includes `start` and `input` extension points from `priestess` for defining application entry points:

```javascript
const main = plugins.create([
  plugins.define(plugins.start)
    .with(plugins.input)
    .as(input => () => console.log(input))
]);
```

## Dependencies 🔗

Built on top of:
- [`sigilium`](https://github.com/phantomaton-ai/sigilium) for extension point patterns
- [`hierophant`](https://github.com/phantomaton-ai/hierophant) for dependency injection
- [`priestess`](https://github.com/phantomaton-ai/priestess) for application lifecycle

## Contributing 🦄

We welcome contributions to the Phantomaton Plugins project! If you have any ideas, bug reports, or pull requests, please feel free to submit them on the [Phantomaton Plugins GitHub repository](https://github.com/phantomaton-ai/phantomaton-plugins).

## License 📜

MIT