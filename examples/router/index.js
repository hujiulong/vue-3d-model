import Vue from 'vue'
import Router from 'vue-router'
import DemoBasic from '../pages/demo-basic'
import DemoEvent from '../pages/demo-event'
import DemoRotate from '../pages/demo-rotate'
import DemoObj from '../pages/demo-obj'
// import DemoGltf from '../pages/demo-gltf'
import DemoStl from '../pages/demo-stl'
// import DemoSea3d from '../pages/demo-sea3d'

Vue.use( Router )

export default new Router( {
    routes: [ 
        {
            path: '/demo-basic',
            name: 'demo-basic',
            component: DemoBasic
        },
        {
            path: '/demo-event',
            name: 'demo-event',
            component: DemoEvent
        },
        {
            path: '/demo-rotate',
            name: 'demo-rotate',
            component: DemoRotate
        },
        {
            path: '/demo-obj',
            name: 'demo-obj',
            component: DemoObj
        },
        // {
        //     path: '/demo-sea3d',
        //     name: 'demo-sea3d',
        //     component: DemoSea3d
        // },
        {
            path: '/demo-stl',
            name: 'demo-stl',
            component: DemoStl
        },
        // {
        //     path: '/demo-gltf',
        //     name: 'demo-gltf',
        //     component: DemoGltf
        // }
    ]
} )