<template>
  <div>
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
    src="/static/models/obj/tree.obj"
  ></model-obj>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { ModelObj } from 'vue-3d-model';

const bgAlpha = ref(0.5);
const bgColor = ref('#ff0');
</script>
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