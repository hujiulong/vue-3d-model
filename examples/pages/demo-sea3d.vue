<template>
    <demo-block :code="code">
        <template slot="preview">
            <model-sea3d :backgroundAlpha="0"
                @on-load="onLoad"
                src="static/models/sea3d/mascot.tjs.sea"></model-sea3d>
            <div class="example-loading" v-show="loading"></div>
        </template>
    </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block';
import ModelSea3d from '../../src/model-sea3d.vue'

const code = `

<template>
    <model-sea3d src="static/models/json/scene.json"></model-sea3d>
</template>

<script>
    import { ModelSea3d } from 'vue-3d-model'

    export default {
        components: {
            ModelSea3d
        }
    }
<\/script>

`

export default {
    name: 'demo-sea3d',
    data() {
        return {
            code,
            loading: true
        }
    },
    methods: {
        onLoad() {
            this.loading = false;
        }
    },
    components: {
        ModelSea3d,
        DemoBlock
    }
}
</script>
