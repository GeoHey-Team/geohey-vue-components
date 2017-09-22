<template>
    <div class="g-color-picker-saturation" 
        :style="{ background: bgColor }" 
        ref="container" 
        @mousedown="handleMouseDown">
        <div class="g-color-picker-saturation-white"></div>
        <div class="g-color-picker-saturation-black"></div>
        <div class="g-color-picker-saturation-pointer" :style="{top: pointerTop, left: pointerLeft}">
            <div class="g-color-picker-saturation-circle"></div>
        </div>
    </div>
</template>


<script>
import throttle from 'lodash.throttle'
export default {
    name: 'Saturation',
    props: {
        value: Object
    },
    computed: {
        hsv() {
            return this.value
        },
        bgColor() {
            return `hsl(${this.hsv.h * 360}, 100%, 50%)`
        },
        pointerTop() {
            return -( this.hsv.v * 100 ) + 100 + '%'
        },
        pointerLeft() {
            return this.hsv.s * 100 + '%'
        }
    },
    methods: {
        throttle: throttle( ( fn, data ) => {
            fn( data )
        }, 20, {
            'leading': true,
            'trailing': false
        } ),
        handleChange( e, skip ) {
            !skip && e.preventDefault()
            var container = this.$refs.container
            var containerWidth = container.clientWidth
            var containerHeight = container.clientHeight
            var left = ( e.touches ? e.touches[ 0 ].clientX : e.clientX ) - container.getBoundingClientRect().left;
            var top = ( e.touches ? e.touches[ 0 ].clientY : e.clientY ) - container.getBoundingClientRect().top;
            if ( left < 0 ) {
                left = 0
            } else if ( left > containerWidth ) {
                left = containerWidth
            } else if ( top < 0 ) {
                top = 0
            } else if ( top > containerHeight ) {
                top = containerHeight
            }
            var saturation = left / containerWidth
            var bright = -( top / containerHeight ) + 1
            this.throttle( this.onChange, {
                h: this.hsv.h,
                s: saturation,
                v: bright
            } )
        },
        onChange( param ) {
            this.$emit( 'input', param )
        },
        handleMouseDown( e ) {
            // this.handleChange(e, true)
            window.addEventListener( 'mousemove', this.handleChange )
            window.addEventListener( 'mouseup', this.handleChange )
            window.addEventListener( 'mouseup', this.handleMouseUp )
        },
        handleMouseUp( e ) {
            window.removeEventListener( 'mousemove', this.handleChange )
            window.removeEventListener( 'mouseup', this.handleChange )
            window.removeEventListener( 'mouseup', this.handleMouseUp )
        }
    }
}

</script>

<style lang="scss" scoped>
.g-color-picker-saturation,
.g-color-picker-saturation-white,
.g-color-picker-saturation-black {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.g-color-picker-saturation-white {
    background: linear-gradient(to right, #fff, rgba(255,255,255,0));
}
.g-color-picker-saturation-black {
    background: linear-gradient(to top, #000, rgba(0,0,0,0));
}
.g-color-picker-saturation-pointer {
    cursor: pointer;
    position: absolute;
}
.g-color-picker-saturation-circle {
    cursor: head;
    width: 10px;
    height: 10px;
    // box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4);
    border-radius: 50%;
    border: 1px solid #fff;
    transform: translate(-5px, -5px);
}
</style>