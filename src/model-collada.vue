<script>
import { ColladaLoader } from './loaders/ColladaLoader'
import { toIndexed } from './util'
import mixin from './model-mixin.vue'

export default {
    name: 'model-collada',
    mixins: [ mixin ],
    props: {
        lights: {
            type: Array,
            default () {
                return [
                    {
                        type: 'HemisphereLight',
                        position: { x: 0, y: 1, z: 0 },
                        skyColor: 0xaaaaff,
                        groundColor: 0x806060,
                        intensity: 0.2
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: 1, y: 1, z: 1 },
                        color: 0xffffff,
                        intensity: 0.8
                    }
                ]
            }
        },
        smoothing: {
            type: Boolean,
            default: false
        }
    },
    data () {

        const loader = new ColladaLoader();
        loader.options.convertUpAxis = true;

        return {
            loader
        }
    },
    methods: {
        load () {

            if ( !this.src ) return;

            if ( this.object ) {
                this.scene.remove( this.object );
            }

            this.loader.load( this.src, collada => {

                this.object = collada.scene;

                this.scene.add( this.object );

                this.updateCamera();

                this.$emit( 'on-load' );

            }, err => {

                this.$emit( 'on-error', err );

            } );

        }
    }
}
</script>
