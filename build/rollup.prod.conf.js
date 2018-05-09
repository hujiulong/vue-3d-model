import vue from 'rollup-plugin-vue'
import shader from 'rollup-plugin-shader'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import alias from 'rollup-plugin-alias'

import pkg from '../package.json'
import path from 'path'

function resolve( dir ) {
    return path.join( __dirname, '..', dir )
}

const banner = `/* @preserve
 * vue-3d-model ${pkg.version}, ${pkg.description}
 * Copyright (c) 2018 Jiulong Hu <me@hujiulong.com>
 */
`;

const input = resolve( 'src/index.js' );

const plugins = [
    alias( require( './alias' ) ),
    nodeResolve(),
    shader(),
    vue(),
    babel( {
        exclude: 'node_modules/**'
    } )
]

const external = [ 'vue' ];

export default [
    {
        input,
        output: {
            file: pkg.main,
            format: 'umd',
            name: pkg.name,
            banner,
            sourcemap: true
        },
        plugins: plugins.concat( [ uglify( { output: { comments: 'some' } } ) ] ),
        external
    },
    {
        input,
        output: {
            file: pkg.module,
            format: 'es',
            banner,
            sourcemap: true
        },
        plugins,
        external
    }
]
