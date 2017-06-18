import ModelObj from './model-obj.vue'
import ModelThree from './model-three.vue'
import ModelStl from './model-stl.vue'

const components = [
    ModelObj,
    ModelThree,
    ModelStl
]

const install = ( Vue ) => {
    components.map( component => {
        Vue.component( component.name, component );
    } );
};

if ( typeof window !== 'undefined' && window.Vue ) {
    install( window.Vue );
};

export { ModelObj, ModelThree }
