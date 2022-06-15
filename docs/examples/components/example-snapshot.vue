<template>
  <button type="button" class="create" @click="snapshot">snapshot</button>
  <model-collada
    ref="model"
    :backgroundAlpha="0"
    :rotation="{
      x: -Math.PI / 2,
      y: 0,
      z: 0,
    }"
    src="/static/models/collada/elf/elf.dae"
    :glOptions="{ preserveDrawingBuffer: true }"
  />
  <img class="snapshot" v-if="base64" :src="base64" />
</template>
<script setup>
import { ref } from 'vue';
import { ModelCollada } from 'vue-3d-model';

const base64 = ref(null);

function snapshot() {
  base64.value = this.$refs.model.renderer.domElement.toDataURL('image/png', 1);
} 

</script>