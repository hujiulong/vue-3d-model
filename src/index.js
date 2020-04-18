import Vue from 'vue';

import ModelObj from './model-obj.vue';
import ModelFbx from './model-fbx.vue';
import ModelThree from './model-three.vue';
import ModelStl from './model-stl.vue';
import ModelPly from './model-ply.vue';
import ModelCollada from './model-collada.vue';
import ModelGltf from './model-gltf.vue';

// alias
const ModelJson = Vue.extend(ModelThree, {
  name: 'model-json',
});

const ModelDae = Vue.extend(ModelCollada, {
  name: 'model-dae',
});

const components = [
  ModelObj,
  ModelFbx,
  ModelThree,
  ModelJson,
  ModelStl,
  ModelPly,
  ModelCollada,
  ModelDae,
  ModelGltf,
];

/* eslint-disable no-shadow */
const install = (Vue) => {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  ModelObj,
  ModelFbx,
  ModelThree,
  ModelJson,
  ModelStl,
  ModelPly,
  ModelCollada,
  ModelDae,
  ModelGltf,
};

export {
  install,
  ModelObj,
  ModelFbx,
  ModelThree,
  ModelJson,
  ModelStl,
  ModelPly,
  ModelCollada,
  ModelDae,
  ModelGltf,
};
