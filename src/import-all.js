const cache = {};

const importAll = resource => {
  // At build-time cache will be populated with all required modules.

  resource.keys().forEach(key => cache[key] = resource(key));
}

importAll(require.context('./swWidgets/', true, /\.js$/));
importAll(require.context('./app/', true, /\.js$/));
importAll(require.context('./less/', true, /\.less$/));