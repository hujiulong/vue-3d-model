export default {
	props: {
        src: {
        	type: String
        },
        position: {
            type: Object,
            default () {
                return { x: 0, y: 0, z: 0 }
            }
        },
        rotation: {
            type: Object,
            default () {
                return { x: 0, y: 0, z: 0 }
            }
        },
        scale: {
            type: Object,
            default () {
                return { x: 0, y: 0, z: 0 }
            }
        }
    },
}