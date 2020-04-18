<template>
    <div class="examples">
        <div class="examples-header">
            <a href="https://github.com/hujiulong/vue-3d-model" class="title">Vue3DModel</a>
            <a href="https://github.com/hujiulong/vue-3d-model" class="github">View on GitHub</a>
        </div>
        <div class="examples-content">
            <ul class="examples-menu">
                <li class="examples-menu-title">Examples</li>
                <li class="examples-menu-item">
                    <router-link to="demo-basic">basic</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-rotate">rotate</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-controls">controls</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-background">background</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-snapshot">snapshot</router-link>
                </li>
                <li class="examples-menu-title">Events</li>
                <li class="examples-menu-item">
                    <router-link to="demo-event">mousemove</router-link>
                </li>
                <li class="examples-menu-title">Model Formats</li>
                <li class="examples-menu-item">
                    <router-link to="demo-json">JSON Model (.json)</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-obj">OBJ Model (.obj)</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-obj-mtl">OBJ + MTL (.obj + .mtl)</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-fbx">FBX Model (.fbx)</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-stl">STL Model (.stl)</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-collada">Collada Model (.dae)</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-ply">PLY Model (.ply)</router-link>
                </li>
                <li class="examples-menu-item">
                    <router-link to="demo-gltf">glTF Model (.gltf)</router-link>
                </li>
            </ul>
            <div class="examples-pages">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'app',
};
</script>
<style>
* {
    margin: 0;
    border: 0;
    padding: 0;
    box-sizing: border-box;
}

ul, ol, li {
    list-style: none;
}

a {
    color: #657180;
    text-decoration: none;
}

html, body, .examples {
    width: 100%;
    height: 100%;
    color: #657180;
}

body {
    background: #eee;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
                 SimSun, sans-serif;
    background: #fff;
}

.examples-header {
    position: absolute;
    top: 0;
    width: 100%;
    background: #f3f6fb;
    text-shadow: 0 1px 0 rgba(255,255,255,0.5);
    border-bottom: solid 1px #dfe2e7;
    padding: 15px 15px 15px 30px;
    line-height: 20px;
}

.examples-header .title {
    font-weight: bold;
    font-size: 18px;
    display: inline-block;
}

.examples-header .github {
    color: #39f;
    display: inline-block;
    font-size: 12px;
    float: right;
}

.examples-content {
    width: 100%;
    height: 100%;
    padding-top: 52px;
    overflow: hidden;
}

.examples-menu {
    float: left;
    width: 230px;
    height: 100%;
    border-right: solid 1px #dfe2e7;
    padding: 10px 30px;
}

.examples-menu .examples-menu-item {
    display: block;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    cursor: pointer;
}

.examples-menu .examples-menu-item > a {
    display: block;
    width: 100%;
    height: 100%;
}

.examples-menu .examples-menu-title {
    display: block;
    width: 100%;
    padding: 6px 0;
    margin-top: 10px;
    font-size: 14px;
    font-weight: bold;
}

.examples-menu .examples-menu-item:hover > a {
    color: #39f;
}

.examples-pages {
    height: 100%;
    overflow: hidden;
}

.example-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
}
.example-loading::before {
    content: '';
    border-radius: 100%;
    margin: 2px;
    border: 3px solid #20a0ff;
    border-bottom-color: transparent;
    height: 36px;
    width: 36px;
    display: inline-block;
    animation: loading-rotate .75s 0s linear infinite;
    vertical-align: middle;
}

.example-loading::after {
    content: '';
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
}

@keyframes loading-rotate{
    0% {
        transform: rotate(0) scale(1);
    }
    50% {
        transform: rotate(180deg) scale(.6);
    }
    100% {
        transform: rotate(360deg) scale(1);
    }
}

</style>
