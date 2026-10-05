export default {
  pearl: {
    input: './spec-open-api/pearl.json',
    output: {
      target: './src/api/pearl.ts',
      override: {
        mutator: {
          path: './src/custom-instance.ts',
          name: 'customFetch',
        },
      },
    },
  },
};
