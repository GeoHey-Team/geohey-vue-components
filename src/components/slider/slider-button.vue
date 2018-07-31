<template>
    <div class="g-slider-button" 
        @dragstart.prevent
        :class="{ dragging: dragging }"
        :style="offsetStyle"
        @mousedown.stop="onMouseDown">
            <div class="g-slider-tooltip" v-if="showTooltip">
                <span>{{ formatedValue }}</span>
                <div class="g-slider-arrow"></div>
            </div>
    </div>
</template>

<script>

import { clamp } from '@/utils/math'
import { getStyle } from '@/utils/dom'

export default {
    name: 'g-slider-button',
    props: {
        value: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            val: this.value,
            left: 0,
            right: 0,
            dragging: false,
            startPosition: 0,
            startX: 0
        };
    },
    computed: {
        lazy () {
            return this.$parent.lazy;
        },
        min () {
            return this.$parent.min;
        },
        max () {
            return this.$parent.max;
        },
        step () {
            return this.$parent.step;
        },
        showTooltip () {
            return this.$parent.showTooltip;
        },
        sliderWidth() {
            return this.$parent.sliderWidth;
        },
        currentPosition() {
            return `${ ( this.val - this.min ) / ( this.max - this.min ) * 100 }%`;
        },
        offsetStyle () {
            return {
                left: this.currentPosition
            }
        },
        widthStyle () {
            return {
                width: this.currentPosition
            }
        },
        precision() {
            let precisions = [ this.min, this.max, this.step ].map( item => {
                let decimal = ( '' + item ).split( '.' )[ 1 ];
                return decimal ? decimal.length : 0;
            } );
            return Math.max.apply( null, precisions );
        },
        formatedValue () {
            const formatter = this.$parent.formatter;
            if ( formatter ) {
                if ( typeof formatter === 'function' ) {
                    return formatter( this.val );
                }
                return formatter[ this.val ];
            }
            return this.val;
        }
    },
    watch: {
        value ( val ) {
            this.val = val;
            this.$emit( 'input', this.val );
        },
        dragging ( val ) {
            this.$parent.dragging = val;
        }
    },
    methods: {
        setPosition ( newPosition ) {
            if (newPosition === null) return;
            if (newPosition < 0) {
                newPosition = 0;
            } else if (newPosition > 100) {
                newPosition = 100;
            }
            const lengthPerStep = 100 / ( ( this.max - this.min ) / this.step);
            const steps = Math.round( newPosition / lengthPerStep );
            let value = steps * lengthPerStep * ( this.max - this.min ) * 0.01 + this.min;
            value = parseFloat(value.toFixed( this.precision ) );

            this.val = value;

            this.$emit( 'input', this.val );
        },
    
        onMouseDown ( event ) {
            this.startX = event.clientX;
            this.startPosition = parseFloat( this.currentPosition );

            this.dragging = true;

            document.addEventListener( 'mouseup', this.onMouseUp, false );
            document.addEventListener( 'mousemove', this.onMouseMove, false );
        },
        onMouseMove ( event ) {

            const diff = ( event.clientX - this.startX ) / this.sliderWidth * 100;

            this.setPosition( this.startPosition + diff )

        },
        onMouseUp ( event ) {
            this.dragging = false;

            setTimeout( () => {
                this.$emit( 'input', this.val );
            }, 0 )

            document.removeEventListener( 'mouseup', this.onMouseUp, false );
            document.removeEventListener( 'mousemove', this.onMouseMove, false );
        }
    }
}

</script>
