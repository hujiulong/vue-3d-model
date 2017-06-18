<script>
import { STLLoader } from './loaders/STLLoader'
import mixin from './model-mixin'
import {
    Mesh,
    MeshPhongMaterial
} from 'three'

export default {
    name: 'model-stl',
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
        }
    },
    data () {
        return {
            loader: new STLLoader()
        }
    },
    methods: {
        load () {

            if ( !this.src ) return;

            if ( this.object ) {
                this.scene.remove( this.object );
            }

            this.loader.load( this.src, geometry => {

                this.object = new Mesh( geometry, new MeshPhongMaterial() );

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
