<template>
    <demo-block :code="code">
        <template slot="preview">
            <model-obj :backgroundAlpha="0"
                @on-load="onLoad"
                :rotation="rotation"
                src="static/models/obj/tree.obj"></model-obj>
            <div class="example-loading" v-show="loading"></div>
        </template>
    </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block';
import ModelObj from '../../src/model-obj.vue'

const code = `

<template>
    <model-obj
        :rotation="rotation"
        src="static/models/obj/tree.obj"></model-obj>
</template>

<script>
    import { ModelObj } from 'vue-3d-model'

    export default {
        data: {
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        created () {
            this.rotate();
        },
        methods: {
            rotate () {
                this.rotation.y += 0.01;
                requestAnimationFrame( this.rotate );
            }
        },
        components: {
            ModelObj
        }
    }
<\/script>

`

export default {
    name: 'demo-rotate',
    data () {
        return {
            code,
            loading: false,
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    },
    methods: {
        onLoad () {
            this.loading = false;
            this.rotate();
        },
        rotate () {
            this.rotation.y += 0.01;
            requestAnimationFrame( this.rotate );
        }
    },
    components: {
        ModelObj,
        DemoBlock
    }
}
</script>