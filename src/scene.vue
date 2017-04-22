<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
import { PerspectiveCamera, Scene, WebGLRenderer, HemisphereLight, DirectionalLight } from 'three/build/three.module.js';

export default {
    name: 'scene',
    props: {
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 400
        },
        camera: {
            type: Object,
            default () {
                return {
                    type: 'perspective',
                    position: { x: 0, y: 0, z: 0 },
                    rotation: { x: 0, y: 0, z: 0 }
                }
            }
        },
        control: {

        },
        lights: {
            type: Array
        }
    },
    data () {
        return {
            renderer: null,
            sceneCamera: null,
            scene: null
        }
    },
    created () {

        this.sceneCamera = new PerspectiveCamera();
        this.sceneCamera.position.set( 0, 0, 1 );

        this.scene = new Scene();

        var light = new HemisphereLight( 0xaaaaff, 0x806060, 0.2 );
        light.position.set( 0, 1, 0 );
        this.scene.add( light );

        var light = new DirectionalLight( 0xffffff, 0.8 );
        light.position.set( 1, 1, 1 );
        this.scene.add( light );

        this.renderer = new WebGLRenderer( { antialias: true } );
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize( this.width, this.height );

        this.animate();
    },
    mounted () {
        this.$el.appendChild( this.renderer.domElement );
    },
    methods: {
        render () {
            this.renderer.render( this.scene, this.sceneCamera );
        },
        animate () {
            this.render();
            requestAnimationFrame( this.animate );
        }
    }
}

</script>

<style>
</style>
