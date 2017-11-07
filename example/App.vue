<template>
    <div id="app">
        <g-color-picker></g-color-picker>
        <g-color-picker hideAlpha></g-color-picker>
        <g-button @click="test1">message</g-button>
        <g-button @click="test2">alert</g-button>
        <g-button @click="test3">notify</g-button>
        <g-button size="small">small</g-button>
        <g-button size="normal">normal</g-button>
        <g-button size="large">large</g-button>
        <g-color-bar-picker v-model="colors1" @input="log" :breaks="5" type="alpha"></g-color-bar-picker>
        <div class="color-bar-list">
            <g-color-bar :colors="colors"></g-color-bar>
            <g-color-bar gradient :colors="colors"></g-color-bar>
        </div>
        <g-switch></g-switch>
        <g-logo></g-logo>
        <g-slider range v-model="arr" show-tooltip></g-slider>
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
            // colors1: [ '#5182e4', '#ce62d6', '#9bcc66', '#8954d4', '#3fb27e' ],
            colors1: [ '#c00000', '#ffffff' ],
            colors: [ '#f3e79b', '#fac484', '#f8a07e', '#eb7f86', '#ce6693', '#a059a0', '#5c53a5' ],
            arr: [ 10, 20 ]
        }
    },
    watch: {
        // colors1: {
        //     deep: true,
        //     handler( val ) {
        //         console.log( val )
        //     }
        // }
    },
    methods: {
        log() {
            console.log( 'change' )
        },
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
