import { Box3 } from 'three/build/three.module.js';

let box = new Box3();

function getSize ( object ) {

	box.setFromObject( object );

	return box.getSize();
}

function getCenter ( object ) {

	box.setFromObject( object );

	return box.getCenter();
}

export { getSize, getCenter }
