<script>
import { ObjectLoader } from 'three'
import mixin from './model-mixin.vue'

export default {
    name: 'model-three',
    mixins: [ mixin ],
    data () {
        return {
            loader: new ObjectLoader()
        }
    }
}
</script>
