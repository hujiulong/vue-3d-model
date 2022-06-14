<template>
  <model-collada
    :backgroundAlpha="0"
    :rotation="{
      x: - Math.PI / 2,
      y: 0,
      z: 0,
    }"
    src="/static/models/collada/elf/elf.dae"
  />
</template>
<script setup>
import { ModelCollada } from 'vue-3d-model';
</script>