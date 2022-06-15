import { defineComponent, App } from 'vue';
import * as Three from 'three';
import ModelObj from './model-obj.vue';
import ModelFbx from './model-fbx.vue';
import ModelThree from './model-three.vue';
import ModelStl from './model-stl.vue';
import ModelPly from './model-ply.vue';
import ModelCollada from './model-collada.vue';
import ModelGltf from './model-gltf.vue';

export { Three };

// alias
const ModelJson = defineComponent({
  name: 'model-json',
  extends: ModelThree,
});

const ModelDae = defineComponent({
  name: 'model-dae',
  extends: ModelCollada,
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

const INSTALLED_KEY = Symbol('VUE_3D_MODEL_INSTALLED');

/* eslint-disable no-shadow */
const install = (app: App) => {
  if ((app as any)[INSTALLED_KEY]) return;
  components.forEach((component) => {
    app.component(component.name, component);
  });
};

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
