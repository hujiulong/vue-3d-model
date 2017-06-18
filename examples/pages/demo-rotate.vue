<style>
    .demo-basic {
        padding: 20px;
        background: #fff;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.1), 0 16px 24px 0 rgba(81,129,228,.1);
    }
</style>
<template>
    <div class="demo-basic">
        <demo-block :code="code">
            <template slot="preview">
                <model-obj :backgroundAlpha="0"
                    @on-load="onLoad"
                    :rotation="rotation"
                    src="static/models/obj/tree.obj"></model-obj>
                <div class="example-loading" v-show="loading"></div>
            </template>
        </demo-block>
    </div>
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

var k = 0;

export default {
    name: 'demo-obj',
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
            // console.log( this )
            k++;
            this.rotation.y += 0.01;
            var rotate = this.rotate;
            // if ( k < 1000 )
            requestAnimationFrame( this.rotate );
            // setInterval( () => {
            //     this.rotation.y += 0.01;
            // }, 16 );
        }
    },
    components: {
        ModelObj,
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