<template>
    <div class="examples">
        <div class="examples-header">
            <h2>Vue 3D Model</h2>
            <a href="https://github.com/hujiulong/vue-3d-model">Github</a>
        </div>
        <ul class="examples-nav">
            <li class="examples-nav-item">
                <router-link to="demo-basic">Basic</router-link>
            </li>
            <li class="examples-nav-item">
                <router-link to="demo-obj">OBJ Model (.obj)</router-link>
            </li>
        </ul>
        <div class="examples-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

export default {
    name: 'app'
}
</script>
<style>
* {
    margin: 0;
    border: 0;
    padding: 0;
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
}

.examples-header {
    padding: 20px 40px;
}

.examples-header h2 {
    display: inline-block;
}

.examples-header > a {
    color: #39f;
    display: inline-block;
    float: right;
}

.examples-nav {
    position: fixed;
    left: 40px;
    top: 100px;
}

.examples-nav .examples-nav-item {
    display: block;
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
}

.examples-nav .examples-nav-item:hover > a {
    color: #39f;
}

.examples-content {
    width: 90%;
    max-width: 1100px;
    min-width: 900px;
    margin: 30px auto 20px;
    padding: 10px;
}
</style>
