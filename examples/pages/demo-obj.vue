<template>
    <demo-block :vue-code="code" :html-code="htmlCode">
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

const htmlCode = `
<body>
    <div id="app">
        <model-obj src="static/models/obj/tree.obj"></model-obj>
    </div>
    #scripts#
    <script>
        new Vue({
            el: '#app'
        })
    <\/script>
</body>
`

export default {
    name: 'demo-obj',
    data () {
    	return {
            code,
            htmlCode,
            loading: true,
            rotation: {
                x: Math.PI / 2,
                y: 0,
                z: 0 
            }
    	}
    },
    methods: {
        onLoad () {
            this.loading = false;
        }
    },
    components: {
        ModelObj,
        DemoBlock
    }
}
</script>