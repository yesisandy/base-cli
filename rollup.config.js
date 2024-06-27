import {defineConfig} from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import externals from 'rollup-plugin-node-externals';

export default defineConfig([
    {
        input: {
            index: './src/index.ts',
        },
        output: {
            dir: 'dist',
            format: 'cjs'
        },
        plugins: [
            nodeResolve(),
            externals({
                devDeps:false,//识别package.json中的依赖,不进行打包；
            }),
            typescript(),
            json(),
            commonjs(), 
            terser()
        ]
    }
])