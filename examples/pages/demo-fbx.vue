<template>
  <demo-block :vue-code="code" :html-code="htmlCode">
    <template slot="preview">
      <model-fbx :backgroundAlpha="0" @on-load="onLoad" @on-error="onError"
                 src="static/models/fbx/dancing.fbx"></model-fbx>
      <div class="example-loading" v-show="loading"></div>
    </template>
  </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block.vue';
import ModelFbx from '../../src/model-fbx.vue';

const code = `
<template>
    <model-obj src="static/models/fbx/dancing.fbx"></model-obj>
</template>

<script>
    import { modelFbx } from 'vue-3d-model'

    export default {
        components: {
            ModelFbx
        }
    }
<\/script>
`;

const htmlCode = `
<body>
    <div id="app">
        <model-fbx src="static/models/fbx/dancing.fbx"></model-fbx>
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
  name: 'demo-fbx',
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
    onError(e) {
      console.error(e);
    },
  },
  components: {
    ModelFbx,
    DemoBlock,
  },
};
</script>
