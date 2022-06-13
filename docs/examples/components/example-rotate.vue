<template>
  <model-collada
    :rotation="rotation"
    @load="onLoad"
    src="/static/models/collada/elf/elf.dae"
  />
</template>
<script setup>
import { reactive } from 'vue';
import { ModelCollada } from 'vue-3d-model';

const rotation = reactive({
  x: -Math.PI / 2,
  y: 0,
  z: 0,
});

function onLoad() {
  rotate();
}

function rotate() {
  requestAnimationFrame(rotate);
  rotation.z += 0.01;
}
</script>