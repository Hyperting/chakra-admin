import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import keysTransformer from 'ts-transformer-keys/transformer'
import { yalcPublish } from '../../scripts/rollup-yalc-publish'

const packageJson = require('./package.json')

export default {
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
        service => ({
          before: [ keysTransformer(service.getProgram()) ],
          after: []
        })
      ]
    }),
    yalcPublish()
  ],
}
