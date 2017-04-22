<template>
    <scene>
        <model-obj src="example/models/obj/LeePerrySmith.obj"></model-obj>
    </scene>
</template>

<script>
import Scene from '../src/scene.vue'
import ModelObj from '../src/model-obj.vue'

export default {
    name: 'app',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    },
    components: {
        Scene,
        ModelObj
    }
}
</script>

<style>

</style>
