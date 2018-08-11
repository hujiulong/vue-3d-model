<script>
import { JSONLoader } from 'three'
import mixin from './model-mixin.vue'

export default {
    name: 'model-json',
    mixins: [ mixin ],
    data() {

        const loader = new JSONLoader();
        loader.setCrossOrigin( this.crossOrigin );

        return {
            loader
        }
    }
}
</script>
