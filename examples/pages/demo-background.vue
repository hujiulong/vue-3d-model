<template>
  <demo-block :vue-code="code" :html-code="htmlCode">
    <template slot="preview">
      <p class="background-text">
        Vue
        <br>3D
        <br>Model
        <br>Background
      </p>
      <div class="background-buttons">
        <p>Color</p>
        <button @click="bgColor = '#ff0'">#ff0</button>
        <button @click="bgColor = '#f00'">#f00</button>
        <button @click="bgColor = '#13ce66'">#13ce66</button>
        <p>Alpha</p>
        <button @click="bgAlpha = 0.5">0.5</button>
        <button @click="bgAlpha = 1">1</button>
        <button @click="bgAlpha = 0">0</button>
      </div>
      <model-obj
        class="model-box"
        :backgroundAlpha="bgAlpha"
        :backgroundColor="bgColor"
        @on-load="onLoad"
        src="static/models/obj/tree.obj"
      ></model-obj>
      <div class="example-loading" v-show="loading"></div>
    </template>
  </demo-block>
</template>
<style>
.background-text {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 1;
  width: 100%;
  transform: translateY(-50%);
  text-align: center;
  font-size: 60px;
}
.background-buttons {
  position: absolute;
  top: 0;
  left: 10px;
  z-index: 3;
}

.background-buttons > p {
  margin-top: 15px;
  color: #000;
}

.background-buttons > button {
  background: #fff;
  padding: 4px 6px;
  margin-top: 5px;
  outline: none;
  border: 1px solid #c4c4c4;
}

.model-box {
  position: relative;
  z-index: 2;
}
</style>

<script>
import DemoBlock from '../components/demo-block.vue';
import ModelObj from '../../src/model-obj.vue';

const code = `
<template>
    <p class="background-text">
        Vue<br>3D<br>Model<br>Background
    </p>
    <div class="background-buttons">
        <p>Color</p>
        <button @click="bgColor = '#ff0'">#ff0</button>
        <button @click="bgColor = '#f00'">#f00</button>
        <button @click="bgColor = '#13ce66'">#13ce66</button>
        <p>Alpha</p>
        <button @click="bgAlpha = 0.5">0.5</button>
        <button @click="bgAlpha = 1">1</button>
        <button @click="bgAlpha = 0">0</button>
    </div>
    <model-obj
        :backgroundAlpha="bgAlpha"
        :backgroundColor="bgColor"
        src="static/models/obj/tree.obj"></model-obj>
</template>

<script>
    import { ModelObj } from 'vue-3d-model'

    export default {
        data () {
            return {
                bgColor: '#ff0',
                bgAlpha: 0.5
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
        <p class="background-text">
            Vue<br>3D<br>Model<br>Background
        </p>
        <div class="background-buttons">
            <p>Color</p>
            <button @click="bgColor = '#ff0'">#ff0</button>
            <button @click="bgColor = '#f00'">#f00</button>
            <button @click="bgColor = '#13ce66'">#13ce66</button>
            <p>Alpha</p>
            <button @click="bgAlpha = 0.5">0.5</button>
            <button @click="bgAlpha = 1">1</button>
            <button @click="bgAlpha = 0">0</button>
        </div>
        <model-obj
            :background-alpha="bgAlpha"
            :background-color="bgColor"
            src="static/models/obj/tree.obj"></model-obj>
    </div>
    #scripts#
    <script>
        new Vue({
            el: '#app',
            data: {
                bgColor: '#ff0',
                bgAlpha: 0.5
            }
        })
    <\/script>
</body>
`;

export default {
  name: 'demo-background',
  data() {
    return {
      code,
      htmlCode,
      loading: true,
      bgColor: '#ff0',
      bgAlpha: 0.5,
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
