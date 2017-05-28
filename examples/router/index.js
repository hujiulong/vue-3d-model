import Vue from 'vue'
import Router from 'vue-router'
import DemoBasic from '../pages/demo-basic'

Vue.use( Router )

export default new Router( {
    routes: [ 
        {
            path: '/demo-basic',
            name: 'demo-basic',
            component: DemoBasic
        }
    ]
} )