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
            <color-fields v-model="color"></color-fields>
        </div>
       <!--  <div class="g-color-field">
            <div class="g-color-field-double">
                <ed-in label="HEX" v-model="hex" @on-change="inputChange"></ed-in>
            </div>
            <div class="g-color-field-single">
                <ed-in label="r" v-model="rgba.r" @on-change="inputChange"></ed-in>
            </div>
            <div class="g-color-field-single">
                <ed-in label="g" v-model="rgba.g" @on-change="inputChange"></ed-in>
            </div>
            <div class="g-color-field-single">
                <ed-in label="b" v-model="rgba.b" @on-change="inputChange"></ed-in>
            </div>
            <div class="g-color-field-single">
                <ed-in label="a" 
                    v-model="color.a" 
                    :arrow-step="0.01" 
                    :min="0.01" 
                    :max="1" 
                    @on-change="inputChange">    
                </ed-in>
            </div>
        </div> -->
        <div class="g-color-presets">
            <div class="g-color-presets-color" v-for="c in presetcolor" :style="{background: c}" @click="handlePreset(c)">
            </div>
        </div>
    </div>
</template>


<script>
import c from '@/utils/color'
// import tinycolor from 'tinycolor2'
import checkboard from './checkboard.vue'
import colorFields from './color-fields'
import editableInput from './editable-input.vue'
import saturation from './saturation.vue'
import hue from './hue.vue'
import alpha from './alpha.vue'

const presetcolor = [
    '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
    '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2',
    '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'
]

var _colorChange = ( () => {

    let color = c();

    return value => {

        console.log( value )

        if ( value && typeof value === 'object' ) {
            color.setRGBA( ...value );
        } else {
            color.set( value );
        }

        return color;

    }

} )();


export default {
    name: 'color-picker',
    props: { 
        value: {
            default: '#fff'
        },
        format: {
            type: String,
            default: 'rgba' // rgb, rgba, hsl, hsv, hex
        }
    },
    components: {
        saturation,
        hue,
        alpha,
        checkboard,
        colorFields,
        'ed-in': editableInput
    },
    data() {
        return {
            val: _colorChange( this.value ),
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
            set ( newVal ) {
                this.val = newVal
            }
        },
        activeColor() {
            return this.color.getStyle();
        }
    },
    watch: {
        value ( newVal ) {
            this.val = _colorChange(newVal)
        },
        val () {

            this.$emit( 'input' );
        }
    },
    methods: {
        colorChange( data ) {
            this.color = _colorChange( data )
        },
        isValidHex( hex ) {

            return tinycolor( hex ).isValid()
        },
        simpleCheckForValidColor( data ) {
            var keysToCheck = [ 'r', 'g', 'b', 'a', 'h', 's', 'a', 'v' ]
            var checked = 0
            var passed = 0

            for ( var i = 0; i < keysToCheck.length; i++ ) {
                var letter = keysToCheck[ i ]
                if ( data[ letter ] ) {
                    checked++
                    if ( !isNaN( data[ letter ] ) ) {
                        passed++
                    }
                }
            }

            if ( checked === passed ) {
                return data
            }
        },
        handlePreset( c ) {
            this.colorChange( {
                hex: c,
                source: 'hex'
            } )
        },
        childChange( data ) {
            this.colorChange( data )
        },
        inputChange( data ) {
            if ( !data ) {
                return
            }
            if ( data.hex ) {
                this.isValidHex( data.hex ) && this.colorChange( {
                    hex: data.hex,
                    source: 'hex'
                } )
            } else if ( data.r || data.g || data.b || data.a ) {
                this.colorChange( {
                    r: data.r || this.color.rgba.r,
                    g: data.g || this.color.rgba.g,
                    b: data.b || this.color.rgba.b,
                    a: data.a || this.color.rgba.a,
                    source: 'rgba'
                } )
            }
        }
    }
}
</script>

<style lang="scss">
@import "common";

.g-color {
    position: relative;
    width: 230px;
    box-sizing: initial;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15);

    @include reset;

    .g-color-saturation-wrap {
        width: 100%;
        height: 150px;
        // padding-bottom: 75%;
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
}

// .g-color-field {
//     display: flex;
//     padding: 4px 10px 0 10px;
//     .g-color-editable-input-input {
//         width: 100%;
//         padding: 4px 10% 3px;
//         border: none;
//         box-shadow: inset 0 0 0 1px #ccc;
//         font-size: 11px;
//         border-radius: 3px;
//     }
//     .g-color-editable-input-label {
//         display: block;
//         text-align: center;
//         font-size: 11px;
//         color: #999;
//         padding-top: 3px;
//         padding-bottom: 4px;
//         text-transform: capitalize;
//     }
// }
.g-color-field-single {
    flex: 1;
    padding-left: 6px;
}
.g-color-field-double {
    flex: 2;
}
.g-color-presets {
    padding: 0 10px 10px 10px;
    border-top: 1px; solid: #eee;
}
.g-color-presets-color {
    border-radius: 2px;
    overflow: hidden;
    position: relative;
    display: inline-block;
    margin: 0 5px 5px 0;
    vertical-align: top;
    cursor: pointer;
    width: 16px;
    height: 16px;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,.15);
}
</style>