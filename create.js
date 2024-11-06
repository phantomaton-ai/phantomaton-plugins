const create = (a, b, c) => {
  const extensions = expose(a);
  const instantiate = configuration => b(configuration);
  const install = plugin => c(plugin);
  const plugin = { extensions: expose(a) };
  return configuration => {
    plugin.configuration = configuration;
    plugin.instance = instantiate(configuration);
    return { install: install(plugin) };
  };
};
