<template>
    <div class="demo-basic">
        <demo-block :code="code">
            <template slot="preview">
                <model-stl :backgroundAlpha="0"
                    @on-load="onLoad"
                    src="static/models/stl/gear.stl"></model-stl>
                <div class="example-loading" v-show="loading"></div>
            </template>
        </demo-block>
    </div>
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
<style>
	.demo-basic {
        padding: 20px;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.1), 0 16px 24px 0 rgba(81,129,228,.1);
	}
</style>
