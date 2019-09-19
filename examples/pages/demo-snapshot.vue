<template>
  <demo-block :vue-code="code" :html-code="htmlCode">
    <template slot="preview">
      <button type="button" class="create" @click="snapshot">snapshot</button>
      <model-collada
        ref="model"
        :backgroundAlpha="0"
        @on-load="onLoad"
        :rotation="rotation"
        src="static/models/collada/elf/elf.dae"
        :glOptions="{ preserveDrawingBuffer: true }"
      />
      <img class="snapshot" v-if="base64" :src="base64" />
      <div class="example-loading" v-show="loading"></div>
    </template>
  </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block.vue';
import ModelCollada from '../../src/model-collada.vue';

const code = `
<template>
  <div>
    <button type="button" class="create" @click="snapshot">snapshot</button>
    <model-collada
      ref="model"
      src="static/models/collada/elf/elf.dae"
      :glOptions="{ preserveDrawingBuffer: true }"
    />
    <img class="snapshot" v-if="base64" :src="base64" />
  </div>
</template>

<script>
  import { ModelCollada } from 'vue-3d-model'

  export default {
    data() {
      return {
        base64: null
      };
    },
    methods: {
      snapshot() {
        this.base64 = this.$refs.model.renderer.domElement.toDataURL('image/png', 1);
      }
    },
    components: {
      ModelCollada
    }
  }
<\/script>
`;

const htmlCode = `
<body>
  <div id="app">
    <button type="button" class="create" @click="snapshot">snapshot</button>
    <model-collada
      ref="model"
      src="static/models/collada/elf/elf.dae"
      :glOptions="{ preserveDrawingBuffer: true }"
    />
    <img class="snapshot" v-if="base64" :src="base64" />
  </div>
  #scripts#
  <script>
    new Vue({
      el: '#app',
      data: {
        base64: null
      },
      methods: {
        snapshot() {
          this.base64 = this.$refs.model.renderer.domElement.toDataURL('image/png', 1);
        }
      }
    })
  <\/script>
</body>
`;

export default {
  name: 'demo-snapshot',
  data() {
    return {
      code,
      htmlCode,
      loading: true,
      base64: null,
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
    snapshot() {
      this.base64 = this.$refs.model.renderer.domElement.toDataURL('image/png', 1);
    },
  },
  components: {
    ModelCollada,
    DemoBlock,
  },
};
</script>

<style>
.create {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10000;
  background: #fff;
  padding: 4px 6px;
  margin-top: 5px;
  outline: none;
  border: 1px solid #c4c4c4;
}

.snapshot {
  position: absolute;
  bottom: 20px;
  left: 20px;
  height: 200px;
  border: 1px solid #c4c4c4;
  border-radius: 2px;
}
</style>
