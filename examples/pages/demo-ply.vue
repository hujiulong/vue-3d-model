<template>
  <demo-block :vue-code="code" :html-code="htmlCode">
    <template slot="preview">
      <model-ply
        :backgroundAlpha="0"
        @on-load="onLoad"
        :rotation="rotation"
        src="static/models/ply/binary/Lucy100k.ply"
      ></model-ply>
      <div class="example-loading" v-show="loading"></div>
    </template>
  </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block.vue';
import ModelPly from '../../src/model-ply.vue';

const code = `
<template>
    <model-ply src="static/models/ply/slotted_disk.ply"></model-ply>
</template>

<script>
    import { ModelPly } from 'vue-3d-model'

    export default {
        components: {
            ModelPly
        }
    }
<\/script>
`;

const htmlCode = `
<body>
    <div id="app">
        <model-ply src="static/models/ply/slotted_disk.ply"></model-ply>
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
  name: 'demo-ply',
  data() {
    return {
      code,
      htmlCode,
      loading: true,
      rotation: {
        x: 0,
        y: Math.PI,
        z: 0,
      },
    };
  },
  methods: {
    onLoad() {
      this.loading = false;
    },
  },
  components: {
    ModelPly,
    DemoBlock,
  },
};
</script>
