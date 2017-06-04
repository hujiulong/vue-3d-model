import { Box3, Vector3, Vector2, BufferAttribute } from 'three';

let box = new Box3();

function getSize( object ) {

    box.setFromObject( object );

    return box.getSize();
}

function getCenter( object ) {

    box.setFromObject( object );

    return box.getCenter();
}

function lightsDiff( lights, oldLights ) {

}

function toIndexed ( bufferGeometry ) {

    var raw_positions = bufferGeometry.getAttribute( 'position' ).array;

    var raw_uvs;
    var hasUV = bufferGeometry.getAttribute( 'uv' ) !== undefined;
    if ( hasUV ) raw_uvs = bufferGeometry.getAttribute( 'uv' ).array;

    var raw_normals;
    var hasNormal = bufferGeometry.getAttribute( 'normal' ) !== undefined;
    if ( hasNormal ) raw_normals = bufferGeometry.getAttribute( 'normal' ).array;

    var indices = [];
    var vertices = [];
    var normals = [];
    var uvs = [];

    var face, face_normalss, face_uvs, tmp_indices;

    var v0 = new Vector3();
    var v1 = new Vector3();
    var v2 = new Vector3();

    var n0 = new Vector3();
    var n1 = new Vector3();
    var n2 = new Vector3();

    var uv0 = new Vector2();
    var uv1 = new Vector2();
    var uv2 = new Vector2();

    for ( var i = 0; i < raw_positions.length; i += 9 ) {

        v0.x = raw_positions[ i ];
        v0.y = raw_positions[ i + 1 ];
        v0.z = raw_positions[ i + 2 ];

        v1.x = raw_positions[ i + 3 ];
        v1.y = raw_positions[ i + 4 ];
        v1.z = raw_positions[ i + 5 ];

        v2.x = raw_positions[ i + 6 ];
        v2.y = raw_positions[ i + 7 ];
        v2.z = raw_positions[ i + 8 ];

        face = [ v0, v1, v2 ];

        if ( hasNormal ) {

            n0.x = raw_normals[ i ];
            n0.y = raw_normals[ i + 1 ];
            n0.z = raw_normals[ i + 2 ];

            n1.x = raw_normals[ i + 3 ];
            n1.y = raw_normals[ i + 4 ];
            n1.z = raw_normals[ i + 5 ];

            n2.x = raw_normals[ i + 6 ];
            n2.y = raw_normals[ i + 7 ];
            n2.z = raw_normals[ i + 8 ];

            face_normalss = [ n0, n1, n2 ];

        }

        if ( hasUV ) {

            uv0.x = raw_uvs[ i ];
            uv0.y = raw_uvs[ i + 1 ];

            uv1.x = raw_uvs[ i + 2 ];
            uv1.y = raw_uvs[ i + 3 ];

            uv2.x = raw_uvs[ i + 4 ];
            uv2.y = raw_uvs[ i + 5 ];

            face_uvs = [ uv0, uv1, uv2 ];

        }

        tmp_indices = [];

        face.forEach( function ( v, i ) {

            var id = exists( v, vertices );
            if ( id == -1 ) {

                id = vertices.length;
                vertices.push( v.clone() );

                if ( hasNormal ) normals.push( face_normalss[ i ].clone() );
                if ( hasUV ) uvs.push( face_uvs[ i ].clone() );

            }
            tmp_indices.push( id );

        } );

        indices.push( tmp_indices[ 0 ], tmp_indices[ 1 ], tmp_indices[ 2 ] );

    }

    var positionBuffer = new Float32Array( vertices.length * 3 );
    if ( hasNormal ) var normalBuffer = new Float32Array( vertices.length * 3 );
    if ( hasUV ) var uvBuffer = new Float32Array( vertices.length * 2 );

    var i2 = 0;
    var i3 = 0;
    for ( i = 0; i < vertices.length; i++ ) {

        i3 = i * 3;

        positionBuffer[ i3 ] = vertices[ i ].x;
        positionBuffer[ i3 + 1 ] = vertices[ i ].y;
        positionBuffer[ i3 + 2 ] = vertices[ i ].z;

        if ( hasNormal ) {

            normalBuffer[ i3 ] = normals[ i ].x;
            normalBuffer[ i3 + 1 ] = normals[ i ].y;
            normalBuffer[ i3 + 2 ] = normals[ i ].z;

        }

        if ( hasUV ) {

            i2 = i * 2;
            uvBuffer[ i2 ] = uvs[ i ].x;
            uvBuffer[ i2 + 1 ] = uvs[ i ].y;

        }

    }

    bufferGeometry.addAttribute( 'position', new BufferAttribute( positionBuffer, 3 ) );
    if ( hasNormal ) bufferGeometry.addAttribute( 'normal', new BufferAttribute( normalBuffer, 3 ) );
    if ( hasUV ) bufferGeometry.addAttribute( 'uv', new BufferAttribute( uvBuffer, 2 ) );
    bufferGeometry.setIndex( new BufferAttribute( new Uint32Array( indices ), 1 ) );
    return bufferGeometry;

    function exists( v, vertices ) {
        for ( var i = 0; i < vertices.length; i++ ) {
            if ( v.equals( vertices[ i ] ) ) return i;
        }
        return -1;
    }
}

export { getSize, getCenter, toIndexed }
