<template>
    <div class="g-input" :class="[ size ]">
        <textarea v-if="type === 'textarea'" class="g-input-input" :class="{ 'with-icon': !!icon, 'is-disabled': disabled, 'has-error': error }" 
            :value="val"
            @input="input"
            :placeholder="placeholder" :disabled="disabled"></textarea>
        <input v-else :type="type" class="g-input-input" :class="{ 'with-icon': !!icon, 'is-disabled': disabled, 'has-error': error }"
            :value="val"
            @input="input"
            :placeholder="placeholder" :disabled="disabled">
        <i class="g-input-icon iconfont" :class="'icon-' + icon" v-if="type !== 'textarea' && !!icon"></i>
    </div>
</template>

<script>
export default {
    name: 'GInput',
    props: {
        value: [ String, Number ],
        placeholder: String,
        size: String,
        disabled: {
            type: Boolean,
            default: false
        },
        error: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'text'
        },
        icon: String
    },
    watch: {
        value ( val ) {
            this.val = val;
        },
        val ( val ) {
            this.$emit( 'input', val );
        }
    },
    data () {
        return {
            val: this.value
        }
    },
    methods: {
        input ( event ) {
            this.val = event.target.value;
        }
    }
};


</script>

<style lang="scss">
@import 'common';
.g-input {
    width: 200px;
    height: 30px;
    line-height: 28px;
    overflow: hidden;
    position: relative;

    &.small {
        height: 26px;
        line-height: 24px;

        .g-input-icon {
            width: 26px;
            height: 26px;
            line-height: 26px;
            font-size: 16px;
        }
    }

    &.large {
        height: 34px;
        line-height: 32px;

        .g-input-icon {
            width: 34px;
            height: 34px;
            line-height: 34px;
            font-size: 20px;
        }
    }

    > textarea {
        resize: none;
    }

    .g-input-icon {
        width: 30px;
        height: 30px;
        position: absolute;
        top: 0;
        left: 1px;
        text-align: center;
        line-height: 30px;
        font-size: 18px;
        color: $fontGray;
    }

    .g-input-input {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        border: 1px solid #d1dbe5;
        font-size: 13px;
        padding: 0 10px;
        transition: border .2s;
        color: #1f2d3d;

        &:hover {
            border-color: #8391a5;
        }

        &:focus {
            border: 1px solid #20a0ff;
        }

        &.with-icon {
            padding-left: 30px;
        }

        &.has-error {
            border-color: $danger;
        }

        &.is-disabled {
            cursor: not-allowed;
            background-color: #eef1f6;
            border-color: #d1dbe5;
            color: #bbb;

            &:hover {
                border-color: #d1dbe5;
            }
        }

    }
}
</style>