---
permalink: /en/guide/api
---

# API

## Props
| prop            | type          | default              |  example                                   |
| --------------- |---------------|----------------------|--------------------------------------------|  
| src             | string        | -                    | './exapmle.obj'                            |
| width           | number        | -                    | 300                                        |
| height          | number        | -                    | 300                                        |
| position        | object        | { x: 0, y: 0, z: 0 } | { x: 100, y: 20, z: -10 }                  |
| rotation        | object        | { x: 0, y: 0, z: 0 } | { x: Math.PI / 2, y: 0, z: - Math.PI / 4 } |
| cameraPosition  | object        | { x: 0, y: 0, z: 0 } | { x: 1, y: 2, z: -3 } |
| cameraRotation  | object        | { x: 0, y: 0, z: 0 } | { x: 3, y: 2, z: -1 } |
| scale           | object        | { x: 1, y: 1, z: 1 } | { x: 2, y: 2, z: 3 }                       |
| lights          | array         | -                    |                                            |
| backgroundColor | number/string | 0xffffff             | 0xffffff/'#f00'/'rgb(255,255,255)'         |
| backgroundAlpha | number        | 1                    | 0.5                                        |
| controlsOptions | object        | -                    | see [OrbitControls Properties](https://threejs.org/docs/#examples/en/controls/OrbitControls) |
| crossOrigin     | string        | anonymous            | anonymous/use-credentials                  |
| requestHeader   | object        | -                    | { 'Authorization: Bearer token' }          |
| outputEncoding     | number       | THREE.LinearEncoding                | see [WebGLRenderer OutputEncoding](https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer.outputEncoding)                                 |
| glOptions       | object        | { antialias: true, alpha: true }  | see [WebGLRenderer Parameters](https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer) |

## Events

| event         |
| ------------- |
| mousedown  |
| mousemove  |
| mouseup    |
| click      |
| load       |
| progress   |
| error      |

## Slots
| slots         |
| ------------- |
| progress-bar  |
| poster  |
