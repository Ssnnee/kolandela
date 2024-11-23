module.exports = function(api) {
  api.cache(true);

  // Define the plugins, combining the existing and the new one
  let plugins = [
    "react-native-reanimated/plugin",
    ["inline-import", { extensions: [".sql"] }]
  ];

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins,
  };
};

