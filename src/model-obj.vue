<template>
    <div v-show="false"></div>
</template>

<script>

import mixin from './model-mixin'
import { getSize, getCenter } from './util'
import { OBJLoader } from './loaders/OBJLoader'

export default {
    name: 'model-obj',
    mixins: [ mixin ],
    data () {
        return {
            object: null,
            loader: new OBJLoader(),
            modelSrc: null
        }
    },
    created () {
        this.modelSrc = this.src;
    },
    watch: {
        src ( val ) {

            this.modelSrc = src;

            if ( !val ) return;

        },
        modelSrc ( val ) {

            if ( !val ) return;

            this.loader.load( val, object => {

                console.log( object )

                this.object = object;

                if ( this.scene ) {
                    this.scene.add( this.object );
                }

            } );
        }
    },
    computed: {
        scene () {
            if ( this.$parent && this.$parent.scene ) {
                return this.$parent.scene;
            }
            return null;
        }
    }
}
</script>
