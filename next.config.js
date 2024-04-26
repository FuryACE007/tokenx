module.exports = {
  // Add any other Next.js configuration options here
  generateStaticParams: async function () {
    return [
      {
        params: {},
        path: '/'
      },
      {
        params: {},
        path: '/token-operations'
      },
      // Add other paths here
    ];
  },
};
