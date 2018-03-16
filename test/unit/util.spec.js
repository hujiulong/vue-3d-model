import {
    getSize,
    getCenter
} from '../../src/util.js'

import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
} from 'three'

test( 'util - getSize', () => {

    const object = new Mesh( new BoxGeometry( 10, 20, 30 ), new MeshBasicMaterial() );

    expect( getSize( object ) ).toEqual( { x: 10, y: 20, z: 30 } );

} );

test( 'util - getCenter', () => {

    const object = new Mesh( new BoxGeometry( 10, 20, 30 ), new MeshBasicMaterial() );

    object.position.set( 10, 20, 30 );

    expect( getCenter( object ) ).toEqual( { x: 10, y: 20, z: 30 } );

} );
