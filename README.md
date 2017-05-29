# vue-3d-model
vue.js 3D model viewer component, based on threejs.

一个展示三维模型的Vue组件，支持模型操作和模型点击事件，目前支持obj格式的模型。

## Example
[示例页面DEMO](https://hujiulong.github.io/vue-3d-model/#/demo-basic)

## Install
using npm
```
npm install vue-3d-model --save
```
Or using script tag for global use
```html
<script type="text/javascript" src="vue-3d-model.min.js"></script>
```

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
## Model Format Support
OBJ(.obj)

//TODO: collada(.dae), obj and mtl, etc

## Browser Support
Modern browsers and IE 11.
