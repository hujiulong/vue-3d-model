<template>
  <div class="controls-buttons">
    <button @click="enablePan = !enablePan">{{ enablePan ? 'disable' : 'enable' }} translation</button>
    <button @click="enableZoom = !enableZoom">{{ enableZoom ? 'disable' : 'enable' }} zoom</button>
    <button @click="enableRotate = !enableRotate">{{ enableRotate ? 'disable' : 'enable' }} rotation</button>
  </div>
  <model-obj
    src="/static/models/obj/tree.obj"
    :controlsOptions="{
      enablePan,
      enableZoom,
      enableRotate,
    }"
  />
</template>
<script setup>
import { ref } from 'vue';
import { ModelObj } from 'vue-3d-model';

const enablePan = ref(true);
const enableZoom = ref(true);
const enableRotate = ref(true);
</script>