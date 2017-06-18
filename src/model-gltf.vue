<script>
import { GLTFLoader } from './loaders/GLTFLoader'
import mixin from './model-mixin.vue'

export default {
    name: 'model-gltf',
    mixins: [ mixin ],
    data () {
        return {
            loader: new GLTFLoader
        }
    },
    methods: {
        load () {

            if ( !this.src ) return;

            if ( this.object ) {
                this.scene.remove( this.object );
            }

            this.loader.load( this.src, data => {

                if ( data.animations ) {

                    let animations = data.animations;

                    for ( let i = 0, l = animations.length; i < l; i++ ) {

                        let animation = animations[ i ];

                        animation.loop = true;
                        animation.play();

                    }

                }

                this.scene = data.scene;
                this.camera = data.cameras[ 1 ];

                this.object = object;

                // this.scene.add( this.object );

                this.updateCamera();

                this.$emit( 'on-load' );

            }, err => {

                this.$emit( 'on-error', err );

            } );

        },
    }
}
</script>
