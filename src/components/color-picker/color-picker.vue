<template>
    <div class="g-color" @click.stop>
        <div class="g-color-saturation-wrap">
            <saturation v-model="hsv"></saturation>
        </div>
        <div class="g-color-controls">
            <div class="g-color-sliders">
                <div class="g-color-hue-wrap">
                    <hue v-model="hsv"></hue>
                </div>
                <div class="g-color-alpha-wrap">
                    <alpha v-model="rgba"></alpha>
                </div>
            </div>
            <div class="g-color-color-wrap">
                <checkboard></checkboard>
                <div class="g-color-active-color" :style="{background: activeColor}"></div>
            </div>
        </div>
        <div class="g-color-fields">
            <color-values v-model="color"></color-values>
        </div>
        <div class="g-color-presets" v-if="!hidePreset">
            <div class="g-color-presets-color-wrap" v-for="c in presetcolor" @click="handlePreset(c)">
                <div class="g-color-presets-color" :style="{ background: c }"></div>
                <checkboard></checkboard>
            </div>
        </div>
    </div>
</template>


<script>
import c from '@/utils/color'
import checkboard from './checkboard.vue'
import colorValues from './color-values'
import saturation from './saturation.vue'
import hue from './hue.vue'
import alpha from './alpha.vue'

const presetcolor = [
    '#f2f6f9', '#58B7FF', '#20A0FF', '#13CE66', '#F7BA2A', '#FF4949',
    '#99A9BF', '#f78e3d', '#00a2ae', '#f5317f', '#4A90E2',
    '#B8E986', '#000000', '#50E3C2', '#9B9B9B', '#FFFFFF'
]

export default {
    name: 'g-color-picker',
    props: { 
        value: {
            default: '#fff'
        },
        format: {
            type: String,
            default: 'rgba' // rgb, rgba, hsl, hsv, hex
        },
        hidePreset: {
            type: Boolean,
            default: false
        }
    },
    components: {
        saturation,
        hue,
        alpha,
        checkboard,
        colorValues
    },
    data() {
        return {
            val: c( this.value ),
            presetcolor: presetcolor
        }
    },
    computed: {
        rgba: {
            get () {
                return {
                    r: Math.round( this.val.r * 255 ),
                    g: Math.round( this.val.g * 255 ),
                    b: Math.round( this.val.b * 255 ),
                    a: this.val.a
                }
            },
            set ( val ) {
                this.val.setRGBA( val.r / 255, val.g / 255, val.b / 255, val.a );
            }
        },
        hex: {
            get () {
                return '#' + this.val.getHexString().toLowerCase();
            },
            set ( val ) {
                if ( val[ 0 ] !== '#' ) {
                    val = '#' + val;
                }
                this.val.setStyle( val );
            }
        },
        hsv: {
            get () {
                return this.val.getHSV();
            },
            set ( val ) {
                this.val.setHSV( val.h, val.s, val.v );
            }
        },
        alpha: {
            get () {
                return this.val.getAlpha();
            },
            set ( val ) {
                this.setAlpha( val );
            }
        },
        color: {
            get () {
                return this.val
            },
            set ( val ) {
                this.val.set( val );
            }
        },
        activeColor() {
            return this.color.getStyle();
        }
    },
    watch: {
        value ( newVal ) {
            this.colorChange( newVal )
        },
        val: {
            deep: true,
            handler () {
                let color;
                let format = this.format;
                if ( format === 'object' ) {
                    color = this.val;
                } else {
                    color = this.val.getStyle( format );
                }
                this.$emit( 'on-change', color );
                this.$emit( 'input', color );
            }
        }
    },
    methods: {
        handlePreset( c ) {
            this.colorChange( c )
        },
        colorChange ( value ) {

            if ( value && typeof value === 'object' ) {
                this.val.setRGBA( ...value );
            } else {
                this.val.set( value );
            }
        }
    }
}
</script>

<style lang="scss">
@import "common";

.g-color {
    @include reset;
    position: relative;
    width: 230px;
    box-sizing: initial;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15);
    overflow: hidden;

    .g-color-saturation-wrap {
        width: 100%;
        height: 150px;
        position: relative;
        overflow: hidden;
    }

    .g-color-controls {
        position: relative;
        padding: 10px 44px 10px 10px;

        .g-color-sliders {
            padding: 4px 0;

            .g-color-hue-wrap {
                position: relative;
                height: 10px;
            }
            .g-color-alpha-wrap {
                position: relative;
                height: 10px;
                margin-top: 4px;
            }
        }

        .g-color-color-wrap {
            width: 24px;
            height: 24px;
            position: absolute;
            top: 10px;
            right: 10px;
            margin-top: 4px;
            margin-left: 4px;
            border-radius: 3px;

            .g-color-active-color {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 2px;
                box-shadow: inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25);
                z-index: 2;
            }
        }
    }

    .g-color-presets {
        padding: 10px;
        border-top: 1px solid #ddd;
        text-align: left;

        .g-color-presets-color-wrap {
            border-radius: 2px;
            overflow: hidden;
            position: relative;
            display: inline-block;
            margin: 0 5px 5px 0;
            vertical-align: top;
            cursor: pointer;
            width: 16px;
            height: 16px;

            .g-color-presets-color {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 10;
                box-shadow: inset 0 0 0 1px rgba(0,0,0,.15);
            }
        }
    }
}

</style>