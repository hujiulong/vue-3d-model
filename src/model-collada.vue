<script>
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import mixin from './model-mixin.vue';

export default {
  name: 'model-collada',
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
    smoothing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const loader = new ColladaLoader();
    loader.setCrossOrigin(this.crossOrigin);

    return {
      loader,
    };
  },
  methods: {
    getObject(collada) {
      return collada.scene;
    },
  },
};
</script>
