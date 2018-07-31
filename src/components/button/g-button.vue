<template>
    <button :disabled="disabled || loading" class="g-button"
        @click="handleClick"
        :autofocus="autofocus"
        type="button"
        :class="[
            type ? type : '',
            size ? size : '',
            {
                'is-round': round,
                'is-disabled': disabled,
                'is-loading': loading
            }
        ]">
        <i class="icon icon-loading icon-pulse" v-if="loading"></i>
        <i class="icon" :class="'icon-' + icon" v-if="icon && !loading"></i>
        <span v-if="$slots.default"><slot></slot></span>
    </button>
</template>

<script>
export default {
    name: 'GButton',
    props: {
        type: {
            type: String,
            default: 'default'
        },
        icon: {
            type: String,
            default: ''
        },
        size: String,
        round: Boolean,
        loading: Boolean,
        disabled: Boolean,
        autofocus: Boolean
    },
    methods: {
        handleClick( event ) {
            if ( this.loading || this.disabled ) return;
            this.$emit( 'click', event );
        }
    }
};


</script>

<style lang="scss">
@import 'common';

.g-button {
    display: inline-block;
    white-space: nowrap;
    cursor: pointer;
    background: #f6fbff;
    border: 1px solid #bfcbd9;
    color: $lightPrimary;
    border-color: $lightPrimary;
    margin: 0;
    border-radius: 4px;
    padding: 0 12px;
    height: 28px;
    line-height: 26px;
    outline: none;
    font-size: 13px;

    &[class*=g-icon-]+span {
        margin-left: 5px;
    }

    &.small {
        height: 24px;
        line-height: 22px;
    }

    &.large {
        height: 32px;
        line-height: 30px;
    }

    &.is-round {
        border-radius: 14px;
        padding: 0 16px;

        &.small {
            border-radius: 12px;
        }
        &.large {
            border-radius: 16px;
        }
    }

    &:focus,
    &:hover {
        color: lighten( $lightPrimary, 10% );
        border-color: lighten( $lightPrimary, 10% );
    }

    &:active {
        color: $darkPrimary;
        border-color: $darkPrimary;
    }

    &.text {
        border: none;
        color: #20a0ff;
        background: 0 0;
        padding-left: 0;
        padding-right: 0;

        &:focus,
        &:hover {
            color: #4db3ff;
        }

        &:active {
            color: #1d90e6;
        }
    }
    
    &.primary {
        color: #fff;
        background-color: #20a0ff;
        border-color: #20a0ff;

        &:focus,
        &:hover {
            background: #4db3ff;
            border-color: #4db3ff;
            color: #fff;
        }

        &:active {
            background: #1d90e6;
            border-color: #1d90e6;
            color: #fff;
        }
    }

    &.info {
        color: #fff;
        background-color: #50bfff;
        border-color: #50bfff;

        &:focus,
        &:hover {
            background: #73ccff;
            border-color: #73ccff;
            color: #fff;
        }

        &:active {
            background: #48ace6;
            border-color: #48ace6;
            color: #fff;
        }
    }

    &.success {
        color: #fff;
        background-color: #13ce66;
        border-color: #13ce66;

        &:focus,
        &:hover {
            background: #42d885;
            border-color: #42d885;
            color: #fff;
        }

        &:active {
            background: #11b95c;
            border-color: #11b95c;
            color: #fff;
        }
    }

    &.warning {
        color: #fff;
        background-color: #f7ba2a;
        border-color: #f7ba2a;

        &:focus,
        &:hover {
            background: #f9c855;
            border-color: #f9c855;
            color: #fff;
        }

        &:active {
            background: #dea726;
            border-color: #dea726;
            color: #fff;
        }
    }

    &.danger {
        color: #fff;
        background-color: #ff4949;
        border-color: #ff4949;

        &:focus,
        &:hover {
            background: #ff6d6d;
            border-color: #ff6d6d;
            color: #fff;
        }

        &:active {
            background: #e64242;
            border-color: #e64242;
            color: #fff;
        }
    }

    &.is-loading {
        position: relative;
        pointer-events: none;

        &:before {
            content: '';
            position: absolute;
            left: -1px;
            top: -1px;
            right: -1px;
            bottom: -1px;
            border-radius: inherit;
            background-color: rgba(255, 255, 255, .35);
        }
    }


    &.is-disabled {
        &,
        &:focus,
        &:hover {
            color: #bfcbd9;
            cursor: not-allowed;
            background-image: none;
            background-color: #eef1f6;
            border-color: #d1dbe5;
        }

        &.text {
            background-color: transparent;
        }
    }

}
</style>