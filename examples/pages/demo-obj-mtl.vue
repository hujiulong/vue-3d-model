<template>
  <demo-block :vue-code="code" :html-code="htmlCode">
    <template slot="preview">
      <model-obj
        :backgroundAlpha="0"
        @on-load="onLoad"
        src="static/models/obj/male02/male02.obj"
        mtl="static/models/obj/male02/male02.mtl"
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
        src="static/models/obj/male02/male02.obj"
        mtl="static/models/obj/male02/male02.mtl"></model-obj>
</template>

<script>
    import { ModelObj } from 'vue-3d-model'

    export default {
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
            src="static/models/obj/male02/male02.obj"
            mtl="static/models/obj/male02/male02.mtl"></model-obj>
    </div>
    #scripts#
    <script>
        new Vue({
            el: '#app'
        })
    <\/script>
</body>
`;

export default {
  name: 'demo-obj-mtl',
  data() {
    return {
      code,
      htmlCode,
      loading: true,
    };
  },
  methods: {
    onLoad() {
      this.loading = false;
    },
  },
  components: {
    ModelObj,
    DemoBlock,
  },
};
</script>
