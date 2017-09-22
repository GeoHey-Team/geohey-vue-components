<template>
    <div class="g-slider" @dragstart.prevent="" @click="onSliderClick">
        <div class="g-slider-runway" ref="slider"></div>
        <div class="g-slider-bar" :style="barStyle"></div>
        <slider-button ref="buttonA" v-model="valA"></slider-button>
        <slider-button v-if="range" ref="buttonB" v-model="valB"></slider-button>
    </div>
</template>

<script>

import { clamp } from '@/utils/math'
import { getStyle } from '@/utils/dom'
import SliderButton from './slider-button'

export default {
    name: 'g-slider',
    components: {
        SliderButton
    },
    props: {
        value: {
            type: Number | Array,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        min: {
            type: Number,
            default: 0
        },
        step: {
            type: Number,
            default: 1
        },
        formatter: {
            type: Array | Object | Function
        },
        showTooltip: {
            type: Boolean,
            default: false
        },
        lazy: {
            type: Boolean,
            default: false
        },
        range: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            valA: this.range && Array.isArray( this.value ) ? this.value[ 0 ] : this.value,
            valB: this.range && Array.isArray( this.value ) ? this.value[ 1 ] : 0,
            dragging: false
        };
    },
    computed: {
        sliderWidth() {
            return parseInt( getStyle( this.$refs.slider, 'width' ), 10 );
        },
        barStyle () {
            return {
                left: Math.min( this.valA, this.valB ) / ( this.max - this.min ) * 100 + '%',
                width: Math.abs( this.valA - this.valB ) / ( this.max - this.min ) * 100 + '%'
            }
        },
        minVal () {
            return Math.min( this.valA, this.valB )
        },
        maxVal () {
            return Math.max( this.valA, this.valB )
        }
    },
    watch: {
        value ( val ) {
            if ( this.dragging ) return;
            if ( this.range ) {
                this.valA = val[ 0 ];
                this.valB = val[ 1 ];
            } else {
                this.valA = val;
            }
        },
        valA () {
            if ( this.range ) {
                this.$emit( 'input', [ this.minVal, this.maxVal ] );
            } else {
                this.$emit( 'input', this.valA )
            }
        },
        valB () {
            this.$emit( 'input', [ this.minVal, this.maxVal ] );
        }
    },
    methods: {
        onSliderClick ( event ) {

            const position = ( event.clientX - this.$refs.slider.getBoundingClientRect().left ) / this.sliderWidth * 100;

            if ( this.range ) {

                const currentPosA = parseFloat( this.$refs.buttonA.currentPosition );
                const currentPosB = parseFloat( this.$refs.buttonB.currentPosition );

                if ( Math.abs( position - currentPosA ) < Math.abs( position - currentPosB ) ) {
                    this.$refs.buttonA.setPosition( position );
                } else {
                    this.$refs.buttonB.setPosition( position );
                }

            } else {
                this.$refs.buttonA.setPosition( position );
            }

        }
    }
}

</script>

<style lang="scss">

@import 'common';

.g-slider {
    position: relative;
    padding: 8px 0;
    height: 18px;
    margin: 4px 6px;

    .g-slider-runway {
        width: 100%;
        height: 2px;
        background: #bfcbd9;
        border-radius: 3px;
    }

    .g-slider-bar {
        height: 100%;
        background: $primary;
        height: 2px;
        position: absolute;
        border-radius: 3px;
        top: 8px;
    }

    .g-slider-button {
        width: 12px;
        height: 12px;
        border: 2px solid $primary;
        background-color: $bgWhite;
        border-radius: 50%;
        position: absolute;
        cursor: pointer;
        margin-left: -6px;
        top: 3px;

        &:hover, &.dragging {
            width: 16px;
            height: 16px;
            top: 1px;
            z-index: 2;
            margin-left: -8px;
        }
    }

    .g-slider-tooltip {
        user-select: none;
        position: absolute;
        border-radius: 4px;
        padding: 10px;
        z-index: 2000;
        font-size: 12px;
        line-height: 1.2;
        background: #1f2d3d;
        color: #fff;
        transform: translateX( -50% );
        margin-top: -48px;

        &::after {
            content: '';
            display: block;
            position: absolute;
            bottom: -5px;
            left: 50%;
            margin-left: -5px;
            border: #1f2d3d solid 5px;
            border-bottom: 0;
            border-left-color: transparent;
            border-right-color: transparent;
        }
    }
}

</style>