<script lang="ts">
import { defineComponent } from 'vue';
import { ObjectLoader } from 'three';
import mixin from './model-mixin.vue';

export default defineComponent({
  name: 'model-three',
  mixins: [mixin],
  data(this: any) {
    const loader = new ObjectLoader();
    loader.setCrossOrigin(this.crossOrigin);
    loader.setRequestHeader(this.requestHeader);

    return {
      loader,
    };
  },
});
</script>
