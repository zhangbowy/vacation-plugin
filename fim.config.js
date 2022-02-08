module.exports = {
  publish: {
    test: {
      exec: 'yarn build:test',
      localDir: './dist',
      remoteDir: '',
      connect: {},
    },

    production: {
      backup: true,
      production: true,
      exec: 'yarn build',
      localDir: './dist',
      remoteDir: '',
      connect: {},
    },
  },
};
