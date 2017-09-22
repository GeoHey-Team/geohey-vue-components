<template>
    <div class="g-color-picker-c-hue">
        <div class="g-color-picker-c-hue-container" ref="container" @mousedown="handleMouseDown" @touchmove="handleChange" @touchstart="handleChange">
            <div class="g-color-picker-c-hue-pointer" :style="{left: pointerLeft}">
                <div class="g-color-picker-c-hue-picker"></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Hue',
    props: {
        value: Object    
    },
    computed: {
        hsv() {
            return this.value
        },
        pointerLeft() {
            return this.hsv.h * 100 + '%'
        }
    },
    methods: {
        handleChange(e, skip) {
            !skip && e.preventDefault()
            var container = this.$refs.container
            var containerWidth = container.clientWidth
            var left = ( e.touches ? e.touches[ 0 ].clientX : e.clientX ) - container.getBoundingClientRect().left
            var h
            var percent

            if (left < 0) {
                h = 0
            } else if ( left >= containerWidth ) {
                h = 360
            } else {
                percent = left * 100 / containerWidth
                h = (360 * percent / 100)
            }

            h = h / 360;

            if (this.hsv.h !== h) {
                this.$emit('input', {
                    h: h,
                    s: this.hsv.s,
                    v: this.hsv.v
                })
            }
        },
        handleMouseDown(e) {
            this.handleChange(e, true)
            window.addEventListener('mousemove', this.handleChange)
            window.addEventListener('mouseup', this.handleMouseUp)
        },
        handleMouseUp(e) {
            this.unbindEventListeners()
        },
        unbindEventListeners() {
            window.removeEventListener('mousemove', this.handleChange)
            window.removeEventListener('mouseup', this.handleMouseUp)
        }
    }
}
</script>
<style lang="scss">
.g-color-picker-c-hue {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    border-radius: 2px;
    background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    border: 1px solid rgba(0, 0, 0, 0.2);
}

.g-color-picker-c-hue-container {
    cursor: pointer;
    margin: 0 3px;
    position: relative;
    height: 100%;
}

.g-color-picker-c-hue-pointer {
    z-index: 2;
    position: absolute;
}

.g-color-picker-c-hue-picker {
    cursor: pointer;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 1);
    background: #fff;
    margin-left: -6px;
    margin-top: -2px;
}
</style>
