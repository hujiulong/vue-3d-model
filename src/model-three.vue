<template>
    <canvas :style="styleObj"></canvas>
</template>

<script>
import { ObjectLoader } from 'three'
import mixin from './model-mixin'

export default {
    name: 'model-three',
    mixins: [ mixin ],
    data () {
        return {
            loader: new ObjectLoader
        }
    }
}
</script>
