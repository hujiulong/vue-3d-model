<script lang="ts">
import { defineComponent } from 'vue';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import mixin from './model-mixin.vue';

export default defineComponent({
  name: 'model-gltf',
  mixins: [mixin],
  props: {
    lights: {
      type: Array,
      default: () => {
        return [
          {
            type: 'AmbientLight',
            color: 0xaaaaaa,
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
    gammaOutput: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const loader = new GLTFLoader();
    loader.setCrossOrigin(this.crossOrigin);
    loader.setRequestHeader(this.requestHeader);

    return {
      loader,
    };
  },
  methods: {
    load() {
      if (!this.src) return;

      if (this.object) {
        this.wrapper.remove(this.object);
      }

      this.reportProgress('start');
      this.loader.load(this.src, (data) => {
        this.reportProgress('end');
        this.addObject(data.scene);

        this.$emit('load');
      }, event => {
        this.reportProgress('progress', event);
        this.$emit('progress', event);
      }, event => {
        this.reportProgress('end');
        this.$emit('error', event);
      });
    },
  },
});
</script>
