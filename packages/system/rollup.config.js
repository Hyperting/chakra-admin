const peerDepsExternal = require('rollup-plugin-peer-deps-external')
const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')
const keysTransformer = require('ts-transformer-keys/transformer').default

console.log(keysTransformer, 'ciao')
// import { yalcPublish } from '../../scripts/rollup-yalc-publish'

const packageJson = require('./package.json')

// eslint-disable-next-line import/no-anonymous-default-export
module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      transformers: [
        (service) => ({
          before: [keysTransformer(service.getProgram())],
          after: [],
        }),
      ],
    }),
    // yalcPublish(),
  ],
}
