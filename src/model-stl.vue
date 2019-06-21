<script>
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import {
  Mesh,
  MeshPhongMaterial,
} from 'three';
import mixin from './model-mixin.vue';

export default {
  name: 'model-stl',
  mixins: [mixin],
  props: {
    lights: {
      type: Array,
      default() {
        return [
          {
            type: 'HemisphereLight',
            position: { x: 0, y: 1, z: 0 },
            skyColor: 0xaaaaff,
            groundColor: 0x806060,
            intensity: 0.2,
          },
          {
            type: 'DirectionalLight',
            position: { x: 1, y: 1, z: 1 },
            color: 0xffffff,
            intensity: 0.8,
          },
        ];
      },
    },
  },
  data() {
    return {
      loader: new STLLoader(),
    };
  },
  methods: {
    getObject(geometry) {
      return new Mesh(geometry, new MeshPhongMaterial());
    },
  },
};
</script>
