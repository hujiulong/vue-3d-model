<template>
  <model-obj
    src="/static/models/obj/tree.obj"
    @mousemove="onMouseMove"
  />
</template>
<script setup>
import { ModelObj } from 'vue-3d-model';

let object = null;

function onMouseMove(event, intersected) {

  if (object) {
    object.material.color.setStyle('#fff');
  }

  if (intersected) {
    object = intersected.object;
    object.material.color.setStyle('#13ce66');
  }
}
</script>