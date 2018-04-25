import {
    getSize,
    getCenter
} from '../../../src/util.js'

import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
} from 'three'

describe( 'util', () => {

    it( 'getSize', done => {

        const object = new Mesh( new BoxGeometry( 10, 20, 30 ), new MeshBasicMaterial() );

        expect( getSize( object ) ).to.include( { x: 10, y: 20, z: 30 } );

        done();
    } );

    it( 'getCenter', done => {

        const object = new Mesh( new BoxGeometry( 10, 20, 30 ), new MeshBasicMaterial() );

        expect( getSize( object ) ).to.include( { x: 10, y: 20, z: 30 } );

        done();
    } );

} );
