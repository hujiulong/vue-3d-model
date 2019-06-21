<template>
  <demo-block :vue-code="code" :html-code="htmlCode">
    <template slot="preview">
      <model-stl :backgroundAlpha="0" @on-load="onLoad" src="static/models/stl/gear.stl"></model-stl>
      <div class="example-loading" v-show="loading"></div>
    </template>
  </demo-block>
</template>

<script>
import DemoBlock from '../components/demo-block.vue';
import ModelStl from '../../src/model-stl.vue';

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
`;

const htmlCode = `
<body>
    <div id="app">
        <model-stl src="static/models/stl/slotted_disk.stl"></model-stl>
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
  name: 'demo-stl',
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
    ModelStl,
    DemoBlock,
  },
};
</script>
