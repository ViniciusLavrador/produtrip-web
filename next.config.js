module.exports = {
  images: {
    domains: ['images.unsplash.com', 's.gravatar.com', 's3.sa-east-1.amazonaws.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
          },
        },
      ],
    });

    return config;
  },
};
