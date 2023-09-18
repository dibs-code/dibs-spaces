import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://api.thegraph.com/subgraphs/name/spsina/dibsaero',
  documents: ['src/apollo/queries.ts'],
  generates: {
    './src/apollo/__generated__/': {
      preset: 'client',
      plugins: ['named-operations-object'],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
