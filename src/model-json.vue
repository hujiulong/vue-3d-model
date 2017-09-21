<script>
import mixin from './model-mixin.vue'

export default {
    name: 'model-json',
    mixins: [ mixin ],
    data () {
        return {
            loader: new JSONLoader()
        }
    }
}
</script>
