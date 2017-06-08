<template>
    <div class="demo-basic">
        <demo-block :code="code">
            <template slot="preview">
                <model-obj :backgroundAlpha="0"
                    ref="model"
                    @on-load="onLoad"
                    @on-mousemove="onMouseMove"
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
    <model-obj 
        src="static/models/obj/tree.obj"
        @on-mousemove="onMouseMove">
    </model-obj>
</template>

<script>
    import { ModelObj } from 'vue-3d-model'

    export default {
        data () {
            return {
                intersected: null
            }
        },
        methods: {
            onMouseMove ( event ) {

                console.log( event );   // event: { distance, face, faceIndex, point, index, uv, object }

                if ( !event ) {

                    if ( this.intersected ) {
                        this.intersected.material.color.setStyle( '#fff' );
                        this.$refs.model.render();  // 当在外部修改模型时，必须调用render，否则不会更新画面
                    }

                    this.intersected = null;
                    return;
                }

                this.intersected = event.object;
                this.intersected.material.color.setStyle( '#13ce66' );
                this.$refs.model.render();  // render
            }
        },
        components: {
            ModelObj
        }
    }
<\/script>

`

export default {
    name: 'demo-obj',
    data () {
        return {
            code,
            loading: false,
            intersected: null
        }
    },
    methods: {
        onLoad () {
            this.loading = false;
        },
        onMouseMove ( event ) {

            console.log( event );

            if ( !event ) {

                if ( this.intersected ) {
                    this.intersected.material.color.setStyle( '#fff' );
                    this.$refs.model.render();
                }

                this.intersected = null;
                return;
            }

            this.intersected = event.object;
            this.intersected.material.color.setStyle( '#13ce66' );
            this.$refs.model.render();
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
