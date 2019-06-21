<template>
  <demo-block :vue-code="code" :html-code="htmlCode">
    <template slot="preview">
      <model-collada
        :backgroundAlpha="0"
        @on-load="onLoad"
        :rotation="rotation"
        src="static/models/collada/elf/elf.dae"
      ></model-collada>
      <div class="example-loading" v-show="loading"></div>
    </template>
  </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block.vue';
import ModelCollada from '../../src/model-collada.vue';

const code = `
<template>
    <model-collada src="static/models/collada/elf.dae"></model-collada>
</template>

<script>
    import { ModelCollada } from 'vue-3d-model'

    export default {
        components: {
            ModelCollada
        }
    }
<\/script>
`;

const htmlCode = `
<body>
    <div id="app">
        <model-collada src="static/models/collada/elf.dae"></model-collada>
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
  name: 'demo-collada',
  data() {
    return {
      code,
      htmlCode,
      loading: true,
      rotation: {
        x: -Math.PI / 2,
        y: 0,
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
    ModelCollada,
    DemoBlock,
  },
};
</script>
