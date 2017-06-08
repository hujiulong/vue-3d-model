<template>
    <div class="demo-block">
        <div class="demo-block-preview">
            <slot name="preview"></slot>
        </div>
        <div class="demo-block-code">
            <pre>
                <code ref="code" v-text="code" class="html"></code>
            </pre>
        </div>
    </div>
</template>

<script>
import 'highlight.js/styles/color-brewer.css';
import hljs from 'highlight.js'

export default {
    name: 'app',
    props: {
        code: String
    },
    mounted () {
        hljs.highlightBlock( this.$refs.code );
    },
    data () {
    	return {}
    },
    methods: {

    },
    components: {

    }
}
</script>
<style>
    .demo-block, .demo-block * {
        box-sizing: border-box;
    }

    .demo-block {
        background-color: #fff;
        border-radius: 3px;
        border: 1px solid #eee;
    }

	.demo-block::after {
        content: '';
        display: block;
        clear: both;
    }

    .demo-block .demo-block-preview {
        position: relative;
        width: 500px;
        height: 500px;
        float: left;
    }

    .demo-block .demo-block-code {
        height: 500px;
        overflow: auto;
        padding: 20px;
        background: #f9fafc;
        border-left: 1px dashed #aaa;
        font-family: Menlo,Monaco,Consolas,Courier,monospace;
        font-size: 13px;
    }
    

    .demo-block .demo-block-code .hljs {
        background: #f9fafc;
    }

</style>
