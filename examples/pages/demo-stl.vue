<template>
    <demo-block :code="code">
        <template slot="preview">
            <model-stl :backgroundAlpha="0"
                @on-load="onLoad"
                src="static/models/stl/gear.stl"></model-stl>
            <div class="example-loading" v-show="loading"></div>
        </template>
    </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block';
import ModelStl from '../../src/model-stl.vue'

const code = `

<template>
    <model-stl src="static/models/stl/slotted_disk.stl"></model-stl>
</template>

<script>
    import { ModelStl } from 'vue-3d-model'

    export default {
        components: {
            ModelStl
        }
    }
<\/script>

`

export default {
    name: 'demo-stl',
    data () {
    	return {
            code,
            loading: false
    	}
    },
    methods: {
        onLoad () {
            this.loading = false;
        }
    },
    components: {
        ModelStl,
        DemoBlock
    }
}
</script>
