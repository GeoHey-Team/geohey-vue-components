<template>
    <div class="g-color-values">
        <div class="g-color-value" :class="{ 'g-color-value-single': field.length === 1, 'g-color-value-multiple': field.length > 1 }">
            <div class="g-color-input-group" v-for="item in field">
                <input type="text" spellcheck="false" class="g-color-input" :value="item.v" @input="handleChange( item.k, $event )">
                <p class="g-color-label">{{ item.k }}</p>
            </div>
        </div>
        <button class="g-color-values-change" @click="changeType">--</button>
    </div>
</template>


<script>
import { clamp } from '@/utils/math'

export default {
    name: 'color-values',
    props: {
        value: Object
    },
    data () {
        return {
            hexSize: 6,
            type: this.value.a === 1 ? 'hex' : 'rgba',
            val: this.value
        }
    },
    watch: {
        value ( val ) {
            this.val = val;
        },
        'val.a' ( alpha ) {
            if ( alpha !== 1 && this.type === 'hex' ) {
                this.changeType();
            }
        }
    },
    computed: {
        allowedTypes () {
            let types = [ 'rgba', 'hsla' ];
            if ( this.val.getAlpha() === 1 ) {
                types.unshift( 'hex' );
            }
            return types;
        },
        field () {

            let type = this.type;

            if ( type === 'hex' ) {

                let hex = this.val.getHexString();

                if ( this.hexSize === 3 && ( hex[ 0 ] === hex[ 1 ] && hex[ 2 ] === hex[ 3 ] && hex[ 4 ] === hex[ 5 ] ) ) {
                    hex = hex[ 0 ] + hex[ 2 ] + hex[ 4 ];
                }

                return [ { k: 'HEX', v: '#' + hex } ];

            } else if ( type === 'rgba' ) {

                return [
                    { k: 'R', v: Math.round( this.val.r * 255 ) },
                    { k: 'G', v: Math.round( this.val.g * 255 ) },
                    { k: 'B', v: Math.round( this.val.b * 255 ) },
                    { k: 'A', v: this.val.a },
                ]

            } else {

                let hsl = this.val.getHSL();
                let a = this.val.getAlpha();

                return [
                    { k: 'H', v: Math.round( hsl.h * 360 ) },
                    { k: 'S', v: Math.round( hsl.s * 100 ) + '%' },
                    { k: 'L', v: Math.round( hsl.l * 100 ) + '%' },
                    { k: 'A', v: a },
                ]
            }
        }
    },
    filters: {
        maxFilter: {
            read( val ) {
                if ( this.max && val > this.max ) {
                    return this.max
                } else {
                    return val
                }
            },
            write( val, oldVal ) {
                return val
            }
        }
    },
    methods: {
        update( e ) {
            this.handleChange( e.target.value )
        },
        handleChange( key, e ) {

            let value = e.target.value;

            if ( key === 'HEX' ) {

                let result = /^\#([A-Fa-f0-9]+)$/.exec( value );

                if ( !result || result[ 1 ].length !== 3 && result[ 1 ].length !== 6 ) return;

                this.hexSize = result[ 1 ].length;

                this.val.setStyle( value );

                this.$emit( 'input', this.val )

            } else if ( [ 'R', 'G', 'B' ].find( item => item === key ) ) {

                value = Number( value );

                if ( isNaN( value ) ) return;

                value = clamp( value, 0, 255 ) / 255;

                let rgb = this.val;

                rgb[ key.toLowerCase() ] = value;

                this.val.setRGB( rgb.r, rgb.g, rgb.b );

                this.$emit( 'input', this.val )

            } else if ( [ 'H', 'S', 'L' ].find( item => item === key ) ) {

                if ( key === 'H' ) {

                    value = Number( value );

                    if ( isNaN( value ) ) return;

                    value = clamp( value, 0, 360 ) / 360;

                } else {

                    let result = /^(\d+)%$/.exec( value );

                    if ( !result ) return;

                    value = Number( result[ 1 ] );

                    value = clamp( value, 0, 100 ) / 100;

                }

                let hsl = this.val.getHSL();

                hsl[ key.toLowerCase() ] = value;

                this.val.setHSL( hsl.h, hsl.s, hsl.l );

                this.$emit( 'input', this.val )

            } else if ( key === 'A' ) {

                value = Number( value );

                if ( isNaN( value ) ) return;

                value = clamp( value, 0, 1 );

                this.val.setAlpha( value )

                this.$emit( 'input', this.val )

            }
        },
        handleBlur( e ) {
            console.log( e )
        },
        handleKeyDown( e ) {
            let val = this.val
            let number = Number( val )
            if ( number ) {
                let amount = this.arrowStep || 1
                    // Up
                if ( e.keyCode === 38 ) {
                    val = number + amount
                    this.handleChange( val )
                    e.preventDefault()
                }
                // Down
                if ( e.keyCode === 40 ) {
                    val = number - amount
                    this.handleChange( val )
                    e.preventDefault()
                }
            }
        },
        handleDrag( e ) {
            console.log( e )
        },
        handleMouseDown( e ) {
            console.log( e )
        },
        changeType () {
            let index = this.allowedTypes.findIndex( item => item === this.type );
            if ( index >= 0 ) {
                this.type = this.allowedTypes[ ( index + 1 ) % this.allowedTypes.length ]
            } else {
                this.type = this.allowedTypes[ 0 ];
            }
            
        }
    }
}

</script>

<style lang="scss">
@import 'common';

.g-color-values {
    width: 100%;
    padding: 10px 44px 10px 10px;
    position: relative;

    .g-color-value {
        width: 100%;

        &::after {
            @include clearfix;
        }

        .g-color-input-group {
            padding: 0 3px;
            text-align: center;
            float: left;

            &:first-child {
                padding-left: 0;
            }

            &:last-child {
                padding-right: 0;
            }

            .g-color-input {
                font-family: Menlo, Consolas, monospace;
                width: 100%;
                font-size: 13px;
                border: 1px solid #ccc;
                border-radius: 3px;
                height: 20px;
                text-align: center;
            }

            .g-color-label {
                color: #999;
                font-size: 13px;
                height: 22px;
                line-height: 22px;
            }
        }

        &.g-color-value-multiple {

            .g-color-input-group {
                width: 25%;
            }
        }

        &.g-color-value-single {

            .g-color-input-group {
                width: 100%;
            }
        }
    }

    .g-color-values-change {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: #fff;
        transition: background .3s;
        cursor: pointer;

        &:hover {
            background: #ddd;
        }
    }
}
</style>