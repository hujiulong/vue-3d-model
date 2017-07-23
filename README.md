# vue-3d-model

<p align="center">
    <a href="https://www.npmjs.com/package/vue-3d-model"><img src="https://img.shields.io/npm/dm/vue-3d-model.svg" alt="Downloads"></a>
    <a href="https://www.npmjs.com/package/vue-3d-model"><img src="https://img.shields.io/npm/v/vue-3d-model.svg" alt="Version"></a>
    <a href="https://www.npmjs.com/package/vue-3d-model"><img src="https://img.shields.io/npm/l/vue-3d-model.svg" alt="License"></a>
</p>

vue.js 3D model viewer component, based on threejs, inspired by [model-tag](https://github.com/mrdoob/model-tag)

一个展示三维模型的Vue组件，支持模型操作和模型点击事件，目前支持obj、stl和json格式的模型。

![preview](./preview.gif)

## Example
[示例页面DEMO](https://hujiulong.github.io/vue-3d-model/#/demo-basic)

## Install
using npm
```
npm install vue-3d-model --save
```
Or using script tag for global use
```html
<script src="https://unpkg.com/vue-3d-model/dist/vue-3d-model.min.js"></script>
```

Or Download <a href="https://unpkg.com/vue-3d-model/dist/vue-3d-model.min.js">vue-3d-model.min.js</a> and include it in your html

## Usage

```vue
<template>
    <model-obj src="example/models/obj/LeePerrySmith.obj"></model-obj>
</template>
<script>
    import { ModelObj } from 'vue-3d-model'

    export default {
        components: { ModelObj }
    }
</script>
```
Or
```vue
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    <div id="app">
        <model-obj src="example/models/obj/LeePerrySmith.obj"></model-obj>
    </div>
    <script src="vue.js"></script>
    <script src="vue-3d-model.min.js"></script>
    <script>
        new Vue({
            el: '#app'
        })
    </script>
</body>
```

## Documents

### props
* src (String)
* width (Number)
* height (Number)
* position (Object) e.g: { x: 100, y: 200, z: 0 }
* rotation (Object) e.g: { x: 0, y: Math.PI / 2, z: 0 }
* scale (Object) e.g: { x: 10, y: 10, z: 10 }
* lights (Array)
* backgroundColor (Number) e.g: 0xffffff
* backgroundAlpha (Number) e.g: 0.5
* controllable (Boolean)

### events
* on-mousedown
* on-mousemove
* on-mouseup
* on-click
* on-load
* on-error

## Model Format Support
OBJ(.obj) three/json(.json)

//TODO: obj and mtl, etc

## Browser Support
Modern browsers and IE 11.
