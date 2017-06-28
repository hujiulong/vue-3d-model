<template>
    <demo-block :code="code">
        <template slot="preview">
            <model-gltf :backgroundAlpha="0"
                @on-load="onLoad"
                src="static/models/gltf/VC.gltf"></model-gltf>
            <div class="example-loading" v-show="loading"></div>
        </template>
    </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block';
import ModelGltf from '../../src/model-gltf.vue'

const code = `

<template>
    <model-obj src="static/models/obj/tree.obj"></model-obj>
</template>

<script>
    import { ModelObj } from 'vue-3d-model'

    export default {
        components: {
            ModelObj
        }
    }
<\/script>

`

export default {
    name: 'demo-gltf',
    data () {
    	return {
            code,
            loading: true
    	}
    },
    methods: {
        onLoad () {
            this.loading = false;
        }
    },
    components: {
        ModelGltf,
        DemoBlock
    }
}
</script>
