<template>
  <div class="demo-block">
    <div class="demo-block-preview">
      <slot name="preview"></slot>
    </div>
    <div class="demo-block-code">
      <div class="demo-block-code-box">
        <h3>Vue Component & Webpack</h3>
        <div class="demo-block-code-box-content">
          <pre>
            <code ref="vueCode" class="html">{{ vueCode | code }}</code>
          </pre>
        </div>
      </div>
      <div class="demo-block-code-box">
        <h3>HTML & JS</h3>
        <div class="demo-block-code-box-content">
          <pre>
            <code ref="htmlCode" class="html">{{ htmlCode | code }}</code>
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js';

/* eslint-disable no-irregular-whitespace */

const codeHandler = (code) => {
  const scripts = `<script src="vue.js"><\/script>
    <script src="vue-3d-model.min.js"><\/script>`;

  return code.replace(/#scripts#/gi, scripts);
};

export default {
  name: 'app',
  props: {
    vueCode: String,
    htmlCode: {
      type: String,
      default: '// TODO',
    },
  },
  mounted() {
    hljs.highlightBlock(this.$refs.vueCode);
    hljs.highlightBlock(this.$refs.htmlCode);
  },
  data() {
    return {};
  },
  filters: {
    code(val) {
      return codeHandler(val);
    },
  },
  components: {},
};
</script>
<style>
.demo-block {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 3px;
}

.demo-block .demo-block-preview {
  width: 50%;
  height: 100%;
  float: left;
  position: relative;
}

.demo-block .demo-block-code {
  width: 50%;
  height: 100%;
  background: #f9fafc;
  border-left: solid 1px #dfe2e7;
  font-size: 13px;
  float: left;
}

.demo-block .demo-block-code pre code {
  font: normal 10pt Consolas, Monaco, monospace;
}

.demo-block .demo-block-code .demo-block-code-box {
  width: 100%;
  height: 50%;
  position: relative;
  overflow: hidden;
}

.demo-block .demo-block-code-box::after {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 90%;
  height: 1px;
  background: -webkit-linear-gradient(
    left,
    #dfe2e7 80%,
    rgba(223, 226, 231, 0) 100%
  );
}

.demo-block .demo-block-code-box h3 {
  width: 100%;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  position: absolute;
}

.demo-block .demo-block-code-box-content {
  position: absolute;
  top: 40px;
  bottom: 10px;
  left: 20px;
  right: 20px;
  overflow: auto;
}

.demo-block .hljs {
  background: transparent;
}

.demo-block .demo-block-code code {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
