import Vue from 'vue'
import Router from 'vue-router'
// import DemoBasic from '../pages/demo-basic'
// import DemoEvent from '../pages/demo-event'
// import DemoBackground from '../pages/demo-background'
// import DemoRotate from '../pages/demo-rotate'
// import DemoObj from '../pages/demo-obj'
// // import DemoGltf from '../pages/demo-gltf'
// import DemoStl from '../pages/demo-stl'
// import DemoCollada from '../pages/demo-collada'
// // import DemoSea3d from '../pages/demo-sea3d'
// import DemoJson from '../pages/demo-json'

import { pages } from '../pages'

Vue.use( Router )

const routes = pages.map( page => {

    const name = page.name;

    return {
        path: `/${name}`,
        name,
        component: page
    }
} )

routes.push( {
    path: '*',
    redirect: '/demo-basic'
} )

export default new Router( { routes } )
