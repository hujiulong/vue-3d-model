<template>
    <div></div>
</template>

<script>
import { OBJLoader } from './loaders/OBJLoader'
import mixin from './model-mixin'
import { getSize, getCenter } from './util'

export default {
    name: 'model-obj',
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
            loader: new OBJLoader
        }
    }
}
</script>
