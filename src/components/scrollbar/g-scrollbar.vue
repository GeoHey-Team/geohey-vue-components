<template>
    <div class="g-scrollbar">
        <div @click="calculateSize" 
            class="g-scrollbar-wrapper" ref="scrollWrapper"><div class="g-scrollbar-area" :class="{ 'g-scrollbar-transition': !this.dragging }" ref="scrollArea" 
                @wheel="scroll" 
                @touchstart="startDrag" 
                @touchmove="onDrag" 
                @touchend="stopDrag">
                <slot></slot>
        </div></div>
        <vertical-scrollbar v-if="ready" 
            :area="{ height: scrollAreaHeight }" 
            :wrapper="{ height: scrollWrapperHeight }" 
            :scrolling="vMovement" 
            :dragging-from-parent="dragging" 
            :on-change-position="handleChangePosition" 
            :on-dragging="handleScrollbarDragging" 
            :on-stop-drag="handleScrollbarStopDrag">
        </vertical-scrollbar>
        <horizontal-scrollbar v-if="ready" 
            :area="{ width: scrollAreaWidth }" 
            :wrapper="{ width: scrollWrapperWidth }" 
            :scrolling="hMovement" 
            :dragging-from-parent="dragging" 
            :on-change-position="handleChangePosition" 
            :on-dragging="handleScrollbarDragging" 
            :on-stop-drag="handleScrollbarStopDrag">
        </horizontal-scrollbar>
    </div>
</template>
<script>
import VerticalScrollbar from './vertical-scrollbar.vue';
import HorizontalScrollbar from './horizontal-scrollbar.vue';

import { getSize } from '@/utils/dom'

export default {

    props: {
        speed: {
            type: Number,
            default: 53
        }
    },

    components: {
        VerticalScrollbar,
        HorizontalScrollbar
    },

    data() {
        return {
            ready: false,
            top: 0,
            left: 0,
            scrollAreaHeight: null,
            scrollAreaWidth: null,
            scrollWrapperHeight: null,
            scrollWrapperWidth: null,
            vMovement: 0,
            hMovement: 0,
            dragging: false,
            eventFlag: {
                top: false,
                bottom: false,
                left: false,
                right: false
            },
            start: {
                y: 0,
                x: 0
            }
        }
    },

    watch: {

        top ( val ) {
            this.$refs.scrollWrapper.scrollTop = val;
        },

        left ( val ) {
            this.$refs.scrollWrapper.scrollLeft = val;
        }

    },

    methods: {

        scroll( e ) {
            e.preventDefault()

            this.calculateSize( () => {
                let num = this.speed

                let shifted = e.shiftKey
                let scrollY = e.deltaY > 0 ? num : -( num )
                let scrollX = e.deltaX > 0 ? num : -( num )

                if ( shifted && e.deltaX == 0 ) scrollX = e.deltaY > 0 ? num : -( num )

                let nextY = this.top + scrollY
                let nextX = this.left + scrollX

                let canScrollY = this.scrollAreaHeight > this.scrollWrapperHeight
                let canScrollX = this.scrollAreaWidth > this.scrollWrapperWidth

                if ( canScrollY && !shifted ) this.normalizeVertical( nextY )

                if ( shifted && canScrollX ) this.normalizeHorizontal( nextX )
            } )

        },

        startDrag( e ) {
            // e.preventDefault()
            // e.stopPropagation()

            e = e.changedTouches ? e.changedTouches[ 0 ] : e

            this.calculateSize( () => {
                this.dragging = true,
                    this.start = {
                        y: e.pageY,
                        x: e.pageX
                    }
            } )

        },

        onDrag( e ) {
            if ( this.dragging ) {

                // e.preventDefault()
                e = e.changedTouches ? e.changedTouches[ 0 ] : e

                let yMovement = this.start.y - e.clientY
                let xMovement = this.start.x - e.clientX

                this.start = {
                    y: e.clientY,
                    x: e.clientX
                }

                let nextY = this.top + yMovement
                let nextX = this.left + xMovement

                this.normalizeVertical( nextY )
                this.normalizeHorizontal( nextX )

            }
        },

        stopDrag( e ) {
            this.dragging = false
        },

        scrollToY( y ) {
            this.normalizeVertical( y )
        },

        scrollToX( x ) {
            this.normalizeVertical( x )
        },

        normalizeVertical( next ) {
            let elementSize = this.getSize()

            // Vertical Scrolling
            let lowerEnd = elementSize.scrollAreaHeight - elementSize.scrollWrapperHeight


            if ( next > lowerEnd ) {

                this.eventFlag.top = false;

                if ( !this.eventFlag.bottom ) {
                    this.eventFlag.bottom = true;
                    this.$emit( 'max-scroll-down' );
                }

                next = lowerEnd
            } else if ( next < 0 ) {

                this.eventFlag.bottom = false;
                
                if ( !this.eventFlag.top ) {
                    this.eventFlag.top = true;
                    this.$emit( 'max-scroll-up' );
                }

                next = 0
            } else {

                this.eventFlag.top = false;
                this.eventFlag.bottom = false;

            }

            this.top = next,
                this.vMovement = next / elementSize.scrollAreaHeight * 100
        },

        normalizeHorizontal( next ) {
            let elementSize = this.getSize()

            let rightEnd = elementSize.scrollAreaWidth - this.scrollWrapperWidth

            if ( next > rightEnd ) next = rightEnd;

            else if ( next < 0 ) next = 0

            this.left = next,
            this.hMovement = next / elementSize.scrollAreaWidth * 100
        },

        handleChangePosition( movement, orientation ) {
            // Make sure the content height is not changed
            this.calculateSize( () => {
                // Convert Percentage to Pixel
                let next = movement / 100
                if ( orientation == 'vertical' ) this.normalizeVertical( next * this.scrollAreaHeight )
                if ( orientation == 'horizontal' ) this.normalizeHorizontal( next * this.scrollAreaWidth )
            } )
        },

        handleScrollbarDragging() {
            this.dragging = true
        },

        handleScrollbarStopDrag() {
            this.dragging = false
        },

        getSize() {
            let $scrollArea = this.$refs.scrollArea
            let $scrollWrapper = this.$refs.scrollWrapper

            let scrollAreaSize = getSize( $scrollArea );
            let scrollWrapperSize = getSize( $scrollWrapper );

            let elementSize = {
                scrollAreaHeight: scrollAreaSize.height,
                scrollAreaWidth: scrollAreaSize.width,

                scrollWrapperHeight: scrollWrapperSize.height,
                scrollWrapperWidth: scrollWrapperSize.width,
            }
            return elementSize
        },

        calculateSize( cb ) {
            if ( typeof cb !== 'function' ) cb = null;

            let elementSize = this.getSize()

            if ( elementSize.scrollWrapperHeight !== this.scrollWrapperHeight ||
                elementSize.scrollWrapperWidth !== this.scrollWrapperWidth ||
                elementSize.scrollAreaHeight !== this.scrollAreaHeight ||
                elementSize.scrollAreaWidth !== this.scrollAreaWidth ) {

                this.scrollAreaHeight = elementSize.scrollAreaHeight,
                this.scrollAreaWidth = elementSize.scrollAreaWidth,

                this.scrollWrapperHeight = elementSize.scrollWrapperHeight,
                this.scrollWrapperWidth = elementSize.scrollWrapperWidth,
                this.ready = true

                return cb ? cb() : false
            } else return cb ? cb() : false
        }


    },

    mounted() {
        this.calculateSize()

        window.addEventListener( 'resize', this.calculateSize )
    },

    beforeDestroy() {
        window.removeEventListener( 'resize', this.calculateSize )
    }

}
</script>
<style lang="scss">
.g-scrollbar {
    position: relative;
    overflow: hidden;
}

.g-scrollbar-area {
    display: inline-block;
    min-width: 100%;
}

.g-scrollbar-transition,
.g-scrollbar-scrollbar-vertical,
.g-scrollbar-scrollbar-horizontal {
    transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -webkit-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
}

.g-scrollbar-transition-scrollbar {
    transition: opacity 0.5s linear;
    -moz-transition: opacity 0.5s linear;
    -webkit-transition: opacity 0.5s linear;
    -o-transition: opacity 0.5s linear;
}

.g-scrollbar-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.g-scrollbar-wrapper:hover .g-scrollbar-scrollbar-vertical,
.g-scrollbar-wrapper:hover .g-scrollbar-scrollbar-horizontal {
    opacity: 1;
}

.g-scrollbar-scrollbar-vertical,
.g-scrollbar-scrollbar-horizontal {
    opacity: 0.5;
    position: absolute;
    background: transparent;
}

.g-scrollbar-scrollbar-vertical:hover,
.g-scrollbar-scrollbar-horizontal:hover {
    background: rgba(0, 0, 0, 0.3);
}

.g-scrollbar-scrollbar-vertical .scrollbar,
.g-scrollbar-scrollbar-horizontal .scrollbar {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    cursor: default;
}

.g-scrollbar-scrollbar-vertical {
    width: 10px;
    height: 100%;
    top: 0;
    right: 0;
}

.g-scrollbar-scrollbar-vertical .scrollbar {
    width: 10px;
}

.g-scrollbar-scrollbar-horizontal {
    height: 10px;
    width: 100%;
    bottom: 0;
    right: 0;
}

.g-scrollbar-scrollbar-horizontal .scrollbar {
    height: 10px;
}
</style>
