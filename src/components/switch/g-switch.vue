<template>
    <div class="g-switch" 
        :class="{ 'disabled': disabled }"
        @click="onMouseClick" 
        @input="updateValue">
        <div class="g-switch-button" :class="{ 'g-switch-button-on': val, 'g-switch-button-off': !val }"></div>
        <div class="g-switch-label"
            :class="{ 'g-switch-label-left': val, 'g-switch-label-right': !val }">
            <span> {{ val ? onText : offText }} </span>
        </div>
    </div>
</template>

<script>

export default {
    name: 'g-switch',
    props: {
        value: {
            type: Boolean,
            default: true
        },
        onText: {
            default: 'ON'
        },
        offText: {
            default: 'OFF'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value ( val ) {
            if ( this.disabled ) return;
            this.val = val;
            this.$emit( 'input', this.val );
        }
    },
    data: function() {
        return {
            val: this.value
        };
    },
    methods: {
        updateValue ( value ) {
            if ( this.disabled ) return;
            this.$emit( 'input', this.val );
        },
        onMouseClick ( event ) {
            if ( this.disabled ) return;
            this.val = !this.val;
            this.$emit( 'input', this.val );
        }
    }
}

</script>

<style lang="scss">
@import 'common';

.g-switch {
    @include reset;
    width: 50px;
    height: 20px;
    margin: 3px 0;
    border-radius: 11px;
    background: $bgWhite;
    position: relative;
    cursor: pointer;
    display: inline-block;
    user-select: none;
    vertical-align: middle;

    &.disabled {
        background: #eee;
        
        .g-switch-label {
            background: #ccc;
        }

    }
    
    .g-switch-button {
        position: absolute;
        margin: 2px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #fff;
        z-index: 2;
        transition: right .3s;

        &.g-switch-button-on {
            right: 0;
        }

        &.g-switch-button-off {
            right: 30px;
        }
    }

    .g-switch-label {
        position: absolute;
        top: 0px;
        width: 100%;
        height: 100%;
        line-height: 20px;
        border-radius: 11px;
        color: #fff;
        font-size: $fontSizeSmall;
        padding: 0 7px;
        transition: background-color .3s;
        text-align: left;

        &.g-switch-label-left {
            background-color: $primary;
        }

        &.g-switch-label-right {
            text-align: right;
            background-color: #ccc;
        }
    }

}
</style>