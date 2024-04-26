module.exports = {
  // Add any other Next.js configuration options here
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/token-operations': { page: '/token-operations' },
      // Add other paths and their page templates here
    };
  },
};
