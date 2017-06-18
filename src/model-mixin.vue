<template>
    <canvas :style="styleObj" v-if="suportWebGL"></canvas>
    <div v-else>
        <slot>
            Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>'
        </slot>
    </div>
</template>

<script>

import {
    Object3D,
    Vector2,
    Vector3,
    Color,
    Scene,
    Raycaster,
    WebGLRenderer,
    PerspectiveCamera,
    AmbientLight,
    HemisphereLight,
    DirectionalLight
} from 'three'
import { getSize, getCenter } from './util'
import { OrbitControls } from './controls/OrbitControls'

const suportWebGL = ( () => {

    try {
        var canvas = document.createElement( 'canvas' ); 
        return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
    } catch ( e ) {
        return false;
    }

} )();

let oldTime = 0;

export default {
    props: {
        src: {
            type: String
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        position: {
            type: Object,
            default () {
                return { x: 0, y: 0, z: 0 }
            }
        },
        rotation: {
            type: Object,
            default () {
                return { x: 0, y: 0, z: 0 }
            }
        },
        scale: {
            type: Object,
            default () {
                return { x: 1, y: 1, z: 1 }
            }
        },
        lights: {
            type: Array,
            default () {
                return [];
            }
        },
        cameraPosition: {
            type: Object
        },
        cameraRotation: {
            type: Object
        },
        cameraUp: {
            type: Object
        },
        cameraLookAt: {
            type: Object
        },
        backgroundColor: {
            default: 0xffffff
        },
        backgroundAlpha: {
            type: Number,
            default: 1
        },
        controllable: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            suportWebGL,
            size: {
                width: this.width,
                height: this.height
            },
            object: null,
            raycaster: new Raycaster(),
            mouse: new Vector2(),
            camera: new PerspectiveCamera( 45, 1, 0.001, 100000 ),
            scene: new Scene(),
            renderer: null,
            controls: null,
            allLights: [],
            clock: typeof performance === 'undefined' ? Date : performance
        }
    },
    computed: {
        styleObj () {
            return {
                width: this.width !== undefined ? this.width + 'px' : '100%',
                height: this.height !== undefined ? this.height + 'px' : '100%',
            }
        },
        hasListener () {

            // 判断是否有鼠标事件监听，用于减少不必要的拾取判断
            const events = this._events;
            let result = {};

            [ 'on-mousemove', 'on-mouseup', 'on-mousedown', 'on-click' ].forEach( name => {
                result[ name ] = !!events[ name ] && events[ name ].length > 0;
            } )

            return result;
        }
    },
    created () {
        if ( window ) {
            window.addEventListener( 'resize', this.onResize, false );
        }
    },
    mounted () {

        if ( this.width === undefined || this.height === undefined ) {
            this.size = {
                width: this.$el.offsetWidth,
                height: this.$el.offsetHeight
            }
        }

        this.renderer = new WebGLRenderer( { antialias: true, alpha: true, canvas: this.$el } )
        this.renderer.shadowMap.enabled = true;

        this.load();
        this.update();

        this.$el.addEventListener( 'mousedown', this.onMouseDown, false );
        this.$el.addEventListener( 'mousemove', this.onMouseMove, false );
        this.$el.addEventListener( 'mouseup', this.onMouseUp, false );
        this.$el.addEventListener( 'click', this.onClick, false );
    },
    beforeDestroy () {

        this.$el.removeEventListener( 'mousedown', this.onMouseDown, false );
        this.$el.removeEventListener( 'mousemove', this.onMouseMove, false );
        this.$el.removeEventListener( 'mouseup', this.onMouseUp, false );
        this.$el.removeEventListener( 'click', this.onClick, false );

    },
    watch: {
        src () {
            this.load();
        },
        object () {
            this.render();
        },
        rotation: {
            deep: true,
            handler( val ) {
                this.object.rotation.set( val.x, val.y, val.z );
                this.render();
            }
        },
        position: {
            deep: true,
            handler( val ) {
                this.object.position.set( val.x, val.y, val.z );
                this.render();
            }
        },
        scale: {
            deep: true,
            handler( val ) {
                this.object.scale.set( val.x, val.y, val.z );
                this.render();
            }
        },
        lights: {
            deep: true,
            handler( val, oldVal ) {
                this.updateLights();
            }
        },
        size: {
            deep: true,
            handler ( val ) {
                this.updateCamera();
                this.updateRenderer();
            }
        },
        controllable () {
            this.updateControls();
        }
    },
    methods: {
        onResize () {

            if ( this.width === undefined || this.height === undefined ) {

                this.$nextTick( () => {
                    this.size = {
                        width: this.$el.offsetWidth,
                        height: this.$el.offsetHeight
                    }
                } )
                
            }
        },
        onMouseDown ( event ) {

            if ( !this.hasListener[ 'on-mousedown' ] ) return;

            const intersected = this.pick( event.clientX, event.clientY );
            this.$emit( 'on-mousedown', intersected );

        },
        onMouseMove ( event ) {

            if ( !this.hasListener[ 'on-mousemove' ] ) return;

            const intersected = this.pick( event.clientX, event.clientY );
            this.$emit( 'on-mousemove', intersected );

        },
        onMouseUp ( event ) {

            if ( !this.hasListener[ 'on-mouseup' ] ) return;

            const intersected = this.pick( event.clientX, event.clientY );
            this.$emit( 'on-mouseup', intersected );

        },
        onClick ( event ) {

            if ( !this.hasListener[ 'on-click' ] ) return;

            const intersected = this.pick( event.clientX, event.clientY );
            this.$emit( 'on-click', intersected );

        },
        pick ( x, y ) {

            if ( !this.object ) return;

            const rect = this.$el.getBoundingClientRect();

            x -= rect.left;
            y -= rect.top;

            this.mouse.x = ( x / this.size.width ) * 2 - 1;
            this.mouse.y = - ( y / this.size.height ) * 2 + 1;

            this.raycaster.setFromCamera( this.mouse, this.camera );

            const intersects = this.raycaster.intersectObject( this.object, true );

            return ( intersects && intersects.length ) > 0 ? intersects[ 0 ] : null;

        },
        update () {

            this.updateRenderer();
            this.updateModel();
            this.updateCamera();
            this.updateLights();
            this.updateControls();

            this.render();
            
        },
        updateModel () {

            let object = this.object;

            if ( !object ) return;

            object.position.copy( this.position );
            object.rotation.copy( this.rotation );
            object.scale.copy( this.scale );

        },
        updateRenderer () {

            let renderer = this.renderer;

            renderer.setSize( this.size.width, this.size.height );
            renderer.setPixelRatio( window.devicePixelRatio || 1 );
            // renderer.setClearColor( new Color( this.backgroundColor ).getHex() );
            renderer.setClearAlpha( this.backgroundAlpha );
        },
        updateCamera () {

            let camera = this.camera;
            let object = this.object;

            let distance = 0;
            let center = null;

            camera.aspect = this.size.width / this.size.height;
            camera.updateProjectionMatrix();

            if ( !this.cameraLookAt && !this.cameraPosition && !this.cameraRotation && !this.cameraUp ) {

                if ( !object ) return;

                distance = getSize( object ).length();
                center = getCenter( object );

                camera.position.set( 0, 0, 0 );
                camera.position.z = distance;
                camera.position.add( center );
                camera.lookAt( center );

            } else {
                // TODO
            }

            if ( this.controls ) this.controls.target.copy( center );

        },
        updateLights () {

            this.scene.remove.apply( this.scene, this.allLights );

            this.allLights = [];

            this.lights.forEach( item => {

                if ( !item.type ) return;

                const type = item.type.toLowerCase();

                let light = null;

                if ( type === 'ambient' || type === 'ambientlight' ) {

                    const color = item.color || 0x404040;
                    const intensity = item.intensity || 1;

                    light = new AmbientLight( color, intensity );

                } else if ( type === 'point' || type === 'pointlight' ) {

                    const color = item.color || 0xffffff;
                    const intensity = item.intensity || 1;
                    const distance = item.distance || 0;
                    const decay = item.decay || 1;

                    light = new PointLight( color, intensity, distance, decay );

                    if ( item.position ) {
                        light.position.copy( item.position );
                    }

                } else if ( type === 'directional' || type === 'directionallight' ) {

                    const color = item.color || 0xffffff;
                    const intensity = item.intensity || 1;

                    light = new DirectionalLight( color, intensity );

                    if ( item.position ) {
                        light.position.copy( item.position );
                    }

                    if ( item.target ) {
                        light.target.copy( item.target );
                    }

                } else if ( type === 'hemisphere' || type === 'hemispherelight' ) {

                    const skyColor = item.skyColor || 0xffffff;
                    const groundColor = item.groundColor || 0xffffff;
                    const intensity = item.intensity || 1;

                    light = new HemisphereLight( skyColor, groundColor, intensity );

                    if ( item.position ) {
                        light.position.copy( item.position );
                    }

                }

                this.allLights.push( light );
                this.scene.add( light );

            } )

        },
        updateControls () {

            if ( this.controllable && this.controls ) return;

            if ( this.controllable ) {

                if ( this.controls ) return;

                this.controls = new OrbitControls( this.camera, this.$el );
                this.controls.addEventListener( 'change', this.render, false );
                this.controls.type = 'orbit';

            } else {

                if ( this.controls ) {

                    this.controls.dispose();
                    this.controls = null;

                }

            }

        },
        load () {

            if ( !this.src ) return;

            if ( this.object ) {
                this.scene.remove( this.object );
            }

            this.loader.load( this.src, object => {

                this.object = object;

                this.scene.add( this.object );

                this.updateCamera();

                this.$emit( 'on-load' );

            }, err => {

                this.$emit( 'on-error', err );

            } );

        },
        animate () {
            requestAnimationFrame( this.animate );
            this.render();
        },
        immediateRender () {
            this.renderer.render( this.scene, this.camera );
        },
        render () {
            // throttle
            let currTime = this.clock.now();
            if ( currTime - oldTime > 16 ) {
                this.immediateRender();
                oldTime = currTime;
            }
        }
    }
}

</script>
<style></style>