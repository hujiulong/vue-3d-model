<script>
import { SEA3DLoader } from './loaders/SEA3DLoader'
import mixin from './model-mixin.vue'

export default {
    name: 'model-sea3d',
    mixins: [ mixin ],
    data () {
        return {
            loader: new SEA3DLoader( {

                autoPlay : true, // Auto play animations
                container : this.scene // Container to add models

            } )
        }
    },
    methods: {
        load () {

            if ( !this.src ) return;

            if ( this.object ) {
                this.scene.remove( this.object );
            }

            this.loader.load( this.src, e => {

                console.log( 'done' )

                var cam = this.loader.getCamera( "Camera007" );
                camera.position.copy( cam.position );
                camera.rotation.copy( cam.rotation );

                controls = new THREE.OrbitControls( camera );

                this.animate();

                // this.object = new Mesh( geometry, new MeshPhongMaterial() );

                // this.scene.add( this.object );

                this.updateCamera();

                this.$emit( 'on-load' );

            }, err => {

                console.log( err )

                this.$emit( 'on-error', err );

            } );

        }
    }
}
</script>
