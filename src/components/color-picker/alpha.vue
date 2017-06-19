<template>
    <div class="g-color-c-alpha">
        <div class="g-color-c-alpha-checkboard-wrap">
            <checkboard></checkboard>
        </div>
        <div class="g-color-c-alpha-gradient" :style="{ background: gradientColor }"></div>
        <div class="g-color-c-alpha-container" ref="container" @mousedown="handleMouseDown" @touchmove="handleChange" @touchstart="handleChange">
            <div class="g-color-c-alpha-pointer" :style="{left: rgba.a * 100 + '%'}">
                <div class="g-color-c-alpha-picker"></div>
            </div>
        </div>
    </div>
</template>


<script>
import checkboard from './checkboard.vue'
export default {
    name: 'Alpha',
    props: {
        value: Object
    },
    components: {
        checkboard
    },
    computed: {
        rgba() {
            return this.value
        },
        gradientColor() {
            var rgba = this.rgba
            var rgbStr = [ rgba.r, rgba.g, rgba.b ].join( ',' );
            return `linear-gradient(to right, rgba( ${ rgbStr }, 0 ) 0%, rgba( ${ rgbStr }, 1 ) 100%)`
        }
    },
    methods: {
        handleChange( e, skip ) {
            !skip && e.preventDefault()
            var container = this.$refs.container
            var containerWidth = container.clientWidth
            var left = ( e.pageX || e.touches[ 0 ].pageX ) - ( container.getBoundingClientRect().left + window.pageXOffset )
            var a
            if ( left < 0 ) {
                a = 0
            } else if ( left > containerWidth ) {
                a = 1
            } else {
                a = Math.round( left * 100 / containerWidth ) / 100
            }
            if ( this.rgba.a !== a ) {
                this.$emit( 'input', {
                    r: this.rgba.r,
                    g: this.rgba.g,
                    b: this.rgba.b,
                    a: a
                } )
            }
        },
        handleMouseDown( e ) {
            this.handleChange( e, true )
            window.addEventListener( 'mousemove', this.handleChange )
            window.addEventListener( 'mouseup', this.handleMouseUp )
        },
        handleMouseUp() {
            this.unbindEventListeners()
        },
        unbindEventListeners() {
            window.removeEventListener( 'mousemove', this.handleChange )
            window.removeEventListener( 'mouseup', this.handleMouseUp )
        }
    }
}

</script>

<style lang="scss">
.g-color-c-alpha {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
}
.g-color-c-alpha-checkboard-wrap {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
}
.g-color-c-alpha-gradient {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
}
.g-color-c-alpha-container {
    cursor: pointer;
    position: relative;
    z-index: 2;
    height: 100%;
    margin: 0 3px;
}
.g-color-c-alpha-pointer {
    z-index: 2;
    position: absolute;
}
.g-color-c-alpha-picker {
    cursor: pointer;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 1);
    background: #fff;
    margin-left: -6px;
    margin-top: -1px;
}
</style>