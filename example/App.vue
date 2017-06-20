<template>
    <div id="app">
        <color-picker></color-picker>
        <g-button @click="test">Button</g-button>
    </div>
</template>
<script>
import * as G from '@'
import Vue from 'vue'

Vue.use( G );

export default {
    name: 'app',
    data() {
        return {
            color: null,
            msg: 'Welcome to Your Vue.js App'
        }
    },
    methods: {
        test () {
            this.$message( '1dasdsadasd' )
        }
    }
}
</script>
<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
