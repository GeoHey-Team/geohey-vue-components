<template>
    <div id="app">
        <g-color-picker></g-color-picker>
        <g-button @click="test1">message</g-button>
        <g-button @click="test2">alert</g-button>
        <g-button @click="test3">notify</g-button>
        <g-color-bar-picker></g-color-bar-picker>
        <div class="color-bar-list">
            <g-color-bar :colors="colors"></g-color-bar>
            <g-color-bar gradient :colors="colors"></g-color-bar>
        </div>
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
            colors: [ '#f3e79b', '#fac484', '#f8a07e', '#eb7f86', '#ce6693', '#a059a0', '#5c53a5' ],
        }
    },
    methods: {
        test1 () {
            this.$message( '1dasdsadasd' )
        },
        test2 () {
            this.$alert( '内容', '标题' )
        },
        test3 () {
            this.$notify( {
              title: '标题名称',
              message: '内容内容内容'
            } );
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

.color-bar-list {
    width: 300px;
}
</style>
