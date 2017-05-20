<template>
    <model-obj
    	class="box"
    	:class="{ 'red': !!intersected }"
    	:backgroundAlpha="0"
    	src="static/models/obj/LeePerrySmith.obj"
    	@on-mousemove="onMouseMove"></model-obj>
</template>

<script>
import ModelObj from '../src/model-obj.vue'

export default {
    name: 'app',
    data () {
    	return {
    		intersected: null
    	}
    },
    methods: {
    	onMouseMove ( event ) {

    		this.intersected = event;

    		// if ( !event ) {

    		// 	if ( this.intersected ) {
    		// 		this.intersected.material.color.setHex( 0xffffff );
    		// 	}

    		// 	return;
    		// }

    		// if ( this.intersected && this.intersected.uuid !== event.object.uuid  ) {
    		// 	this.intersected.material.color.setHex( 0xffffff );
    		// }

    		// this.intersected = event.object;

    		// this.intersected.material.color.setHex( 0xff0000 );

    	}
    },
    components: {
        ModelObj
    }
}
</script>
<style>
	.box {
		margin: 0;
		border: 0;
		padding: 0;
		width: 400px;
		height: 400px;
		background: #fff;
		transition: all .3s;
	}

	.box canvas {
		background: transparent;
	}

	.box.red {
		background: #F7BA2A;
	}
</style>
