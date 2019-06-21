<template>
  <demo-block :vue-code="code" :html-code="htmlCode">
    <template slot="preview">
      <model-obj
        :backgroundAlpha="0"
        ref="model"
        @on-load="onLoad"
        @on-mousemove="onMouseMove"
        src="static/models/obj/tree.obj"
      ></model-obj>
      <div class="example-loading" v-show="loading"></div>
    </template>
  </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block.vue';
import ModelObj from '../../src/model-obj.vue';

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
                    }

                    this.intersected = null;
                    return;
                }

                this.intersected = event.object;
                this.intersected.material.color.setStyle( '#13ce66' );
            }
        },
        components: {
            ModelObj
        }
    }
<\/script>

`;

const htmlCode = `
<body>
    <div id="app">
        <model-obj 
            src="static/models/obj/tree.obj"
            @on-mousemove="onMouseMove">
        </model-obj>
    </div>
    #scripts#
    <script>
        new Vue({
            el: '#app',
            data: {
                intersected: null
            },
            methods: {
                onMouseMove ( event ) {

                    console.log( event );   // event: { distance, face, faceIndex, point, index, uv, object }

                    if ( !event ) {

                        if ( this.intersected ) {
                            this.intersected.material.color.setStyle( '#fff' );
                        }

                        this.intersected = null;
                        return;
                    }

                    this.intersected = event.object;
                    this.intersected.material.color.setStyle( '#13ce66' );
                }
            }
        })
    <\/script>
</body>
`;

export default {
  name: 'demo-event',
  data() {
    return {
      code,
      htmlCode,
      loading: true,
      intersected: null,
    };
  },
  methods: {
    onLoad() {
      this.loading = false;
    },
    onMouseMove(event) {
      console.log(event);

      if (!event) {
        if (this.intersected) {
          this.intersected.material.color.setStyle('#fff');
        }

        this.intersected = null;
        return;
      }

      this.intersected = event.object;
      this.intersected.material.color.setStyle('#13ce66');
    },
  },
  components: {
    ModelObj,
    DemoBlock,
  },
};
</script>
