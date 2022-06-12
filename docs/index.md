# Hello World


<script setup>
import {ModelObj} from '../src';

function handleMouseMove(inst) {
  console.log(inst);
}
</script>

<model-obj src="static/models/obj/tree.obj" @on-mousemove="handleMouseMove" />