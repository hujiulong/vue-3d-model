import Vue from 'vue'
import Router from 'vue-router'
import DemoBasic from '../pages/demo-basic'
import DemoEvent from '../pages/demo-event'
import DemoObj from '../pages/demo-obj'

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
            path: '/demo-obj',
            name: 'demo-obj',
            component: DemoObj
        }
    ]
} )