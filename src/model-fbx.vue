<script lang="ts">
import { defineComponent } from 'vue';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import mixin from './model-mixin.vue';

export default defineComponent({
  name: 'model-fbx',
  mixins: [mixin],
  props: {
    lights: {
      type: Array,
      default() {
        return [
          {
            type: 'HemisphereLight',
            position: { x: 0, y: 1, z: 0 },
            skyColor: 0xffffff,
            groundColor: 0xffffff,
            intensity: 0.8,
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
      loader: new FBXLoader(),
    };
  },
  methods: {
    getObject(geometry: any) {
      (this as any).animations = geometry.animations;
      return geometry;
    },
  },
});
</script>
