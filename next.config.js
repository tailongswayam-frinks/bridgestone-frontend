module.exports = {
  reactStrictMode: true,
  images: {
    loader: 'custom',
  },
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      use: 'raw-loader',
    });

    return config;
  },
};
