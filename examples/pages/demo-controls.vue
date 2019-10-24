<template>
  <demo-block :vue-code="code" :html-code="htmlCode">
    <template slot="preview">
      <div class="controls-buttons">
        <button @click="toggle('pan')">{{ enablePan ? 'disable' : 'enable' }} translation</button>
        <button @click="toggle('zoom')">{{ enableZoom ? 'disable' : 'enable' }} zoom</button>
        <button @click="toggle('rotate')">{{ enableRotate ? 'disable' : 'enable' }} rotation</button>
      </div>
      <model-obj
        :backgroundAlpha="0"
        @on-load="onLoad"
        src="static/models/obj/tree.obj"
        :controlsOptions="{
          enablePan,
          enableZoom,
          enableRotate,
        }"
      ></model-obj>
      <div class="example-loading" v-show="loading"></div>
    </template>
  </demo-block>
</template>

<style>
.controls-buttons {
  width: 130px;
}
.controls-buttons > button {
  background: #fff;
  padding: 4px 6px;
  margin-top: 5px;
  margin-left: 4px;
  outline: none;
  cursor: pointer;
  border: 1px solid #c4c4c4;
}
</style>

<script>
import DemoBlock from '../components/demo-block.vue';
import ModelObj from '../../src/model-obj.vue';

const code = `
<template>
    <div>
        <div class="controls-buttons">
            <button @click="toggle('pan')">{{ enablePan ? 'disable' : 'enable' }} translation</button>
            <button @click="toggle('zoom')">{{ enableZoom ? 'disable' : 'enable' }} zoom</button>
            <button @click="toggle('rotate')">{{ enableRotate ? 'disable' : 'enable' }} rotation</button>
        </div>
        <model-obj src="static/models/obj/tree.obj"></model-obj>
    </div>
</template>

<script>
    import { ModelObj } from 'vue-3d-model'

    export default {
        data() {
            return {
                enablePan: true,
                enableZoom: true,
                enableRotate: true,
            }
        },
        methods: {
            toggle(type) {
                if (type === 'pan') this.enablePan = !this.enablePan;
                if (type === 'zoom') this.enableZoom = !this.enableZoom;
                if (type === 'rotate') this.enableRotate = !this.enableRotate;
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
        <div class="controls-buttons">
            <button @click="toggle('pan')">{{ enablePan ? 'disable' : 'enable' }} translation</button>
            <button @click="toggle('zoom')">{{ enableZoom ? 'disable' : 'enable' }} zoom</button>
            <button @click="toggle('rotate')">{{ enableRotate ? 'disable' : 'enable' }} rotation</button>
        </div>
        <model-obj src="static/models/obj/tree.obj"></model-obj>
    </div>
    #scripts#
    <script>
        new Vue({
            el: '#app',
            data() {
                return {
                    enablePan: true,
                    enableZoom: true,
                    enableRotate: true,
                }
            },
            methods: {
                toggle(type) {
                    if (type === 'pan') this.enablePan = !this.enablePan;
                    if (type === 'zoom') this.enableZoom = !this.enableZoom;
                    if (type === 'rotate') this.enableRotate = !this.enableRotate;
                }
            },
        })
    <\/script>
</body>
`;

export default {
  name: 'demo-controls',
  data() {
    return {
      code,
      htmlCode,
      loading: true,
      enablePan: true,
      enableZoom: true,
      enableRotate: true,
    };
  },
  methods: {
    onLoad() {
      this.loading = false;
    },
    toggle(type) {
      if (type === 'pan') this.enablePan = !this.enablePan;
      if (type === 'zoom') this.enableZoom = !this.enableZoom;
      if (type === 'rotate') this.enableRotate = !this.enableRotate;
    },
  },
  components: {
    ModelObj,
    DemoBlock,
  },
};
</script>
