import {
    Object3D,
    Vector3,
    Color,
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    AmbientLight,
    HemisphereLight,
    DirectionalLight
} from 'three'
import { getSize, getCenter } from './util'
import { OrbitControls } from './controls/OrbitControls'

export default {
    props: {
        src: {
            type: String
        },
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 400
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
    data() {
        return {
            object: null,
            camera: new PerspectiveCamera( 45, 1, 0.001, 100000 ),
            scene: new Scene(),
            renderer: new WebGLRenderer( { antialias: true, alpha: true } ),
            controls: null,
            allLights: []
        }
    },
    created() {

        this.renderer.shadowMap.enabled = true;

        this.load();
        this.update();
    },
    mounted() {
        this.$el.appendChild( this.renderer.domElement );
    },
    watch: {
        src () {
            this.load();
        },
        object () {
            this.render();
        },
        lights: {
            deep: true,
            handler( val, oldVal ) {
                this.updateLights();
            }
        },
        width () {
            this.updateRenderer();
        },
        height () {
            this.updateRenderer();
        },
        controllable () {
            this.updateControls();
        },
    },
    methods: {
        update() {

            this.updateRenderer();
            this.updateModel();
            this.updateCamera();
            this.updateLights();
            this.updateControls();

            this.render();
            
        },
        updateModel() {

            let object = this.object;

            if ( !object ) return;

            object.position.copy( this.position );
            object.rotation.copy( this.rotation );
            object.scale.copy( this.scale );

        },
        updateRenderer() {

            let renderer = this.renderer;

            renderer.setSize( this.width, this.height );
            renderer.setPixelRatio( window.devicePixelRatio || 1 );
            renderer.setClearColor( new Color( this.backgroundColor ).getHex() );
            renderer.setClearAlpha( this.backgroundAlpha );
        },
        updateCamera() {

            let camera = this.camera;
            let object = this.object;

            let distance = 0;
            let center = null;

            camera.aspect = this.width / this.height;

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
        updateLights() {

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

            if ( this.controllable && this.controls ) reutrn;

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
        load() {

            if ( !this.src ) return;

            if ( this.object ) {
                this.scene.remove( this.object );
            }

            this.loader.load( this.src, object => {

                this.object = object;

                this.scene.add( this.object );

                this.updateCamera();

            } );

        },
        render() {
            this.renderer.render( this.scene, this.camera );
        }
    }
}
