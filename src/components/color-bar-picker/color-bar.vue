<template>
    <div class="color-bar">
        <div v-if="gradient" class="color-bar-gradient" :style="gradientStyle"></div>
        <ul v-else class="color-bar-discrete">
            <li v-for="( color, index ) in colors" :style="{
                'background': color,
                'width': 1 / colors.length * 100 + '%'
                }"
                @click="select( color, index )"></li>
        </ul>
    </div>
</template>

<script>
import Vue from 'vue'
import c from '@/utils/color'

export default {
    name: 'g-color-bar',
    props: {
        gradient: {
            type: Boolean,
            default: false
        },
        colors: Array
    },
    data () {
        return {
            selected: 0
        }
    },
    computed: {
        gradientStyle () {
            return {
                'background': this.colors.length > 1 ? `linear-gradient(to right, ${ this.colors.join( ',' ) })` : this.colors[ 0 ]
            }
        }
    },
    methods: {
        select ( color, index ) {
            this.$emit( 'on-select', {
                color, index
            } )
        }
    }
}

</script>
<style lang="scss">
@import 'common';

.color-bar {
    @include reset;
    width: 100%;
    height: 36px;
    padding: 15px 16px;
    position: relative;

    .color-bar-gradient {
        display: block;
        height: 6px;
        width: 100%;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 3px;
        cursor: pointer;
    }

    .color-bar-discrete {
        margin: 0;
        display: block;
        height: 6px;
        width: 100%;

        > li {
            margin: 0;
            padding: 0;
            display: block !important;
            float: left;
            height: 100%;
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-width: 1px 0;
            cursor: pointer;

            &:first-child {
                border-width: 1px 0 1px 1px;
                border-radius: 3px 0 0 3px;
            }

            &:last-child {
                border-width: 1px 1px 1px 0;
                border-radius: 0 3px 3px 0;
            }
        }
    }
}

</style>