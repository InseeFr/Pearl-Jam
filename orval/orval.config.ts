export default {
  pearl: {
    input: './pearl.json',
    output: {
      target: '../src/api/pearl.ts',
      override: {
        mutator: {
          path: '../src/custom-instance.ts',
          name: 'customFetch',
        },
      },
    },
  },
};
