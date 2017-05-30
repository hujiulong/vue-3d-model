<template>
    <canvas :style="styleObj"></canvas>
</template>

<script>
import { JSONLoader } from 'three'
import mixin from './model-mixin'

export default {
    name: 'model-json',
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
            loader: new JSONLoader
        }
    }
}
</script>
