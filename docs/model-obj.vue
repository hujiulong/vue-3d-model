<template>
  <ModelObj
    src="static/models/obj/tree.obj"
    @on-mousemove="handleMouseMove"
  />
</template>

<script setup>
import { ModelObj } from '../src';

function handleMouseMove(inst) {
  console.log('move', inst);
}

</script>
