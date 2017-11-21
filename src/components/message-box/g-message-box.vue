<template>
<transition name="g-message-box-fade">
    <div class="g-message-box-wrapper" :class="{ 'private': hasParent }" v-show="visible" @click.self="handleWrapperClick">
        <div class="g-message-box" :class="customClass">
            <div class="g-message-box-header" v-if="title !== undefined">
                <div class="g-message-box-title">{{ title || '提示' }}</div>
                <i class="g-message-box-close icon icon-close"
                    :class="{ 'is-disabled': this.cancelButtonDisabled }" @click="handleAction('cancel')" v-if="showClose"></i>
            </div>
            <div class="g-message-box-content" v-if="message !== ''">
                <div class="g-message-box-status" v-if="typeClass" :class="type">
                    <i class="icon" :class="typeClass"></i>
                </div>
                <div class="g-message-box-message" :style="{ 'margin-left': typeClass ? '50px' : '0' }">
                    <slot><p>{{ message }}</p></slot>
                </div>
            </div>
            <div class="g-message-box-footer">
                <g-button
                    :disabled="cancelButtonDisabled"
                    :type="cancelButtonType"
                    :loading="cancelButtonLoading"
                    :class="[ cancelButtonClasses ]"
                    v-show="showCancelButton"
                    @click.native="handleAction('cancel')">
                    {{ cancelButtonText || '取消' }}
                </g-button>
                <g-button
                    :disabled="confirmButtonDisabled"
                    :type="confirmButtonType"
                    :loading="confirmButtonLoading"
                    ref="confirm"
                    :class="[ confirmButtonClasses ]"
                    v-show="showConfirmButton"
                    @click.native="handleAction('confirm')">
                    {{ confirmButtonText || '确定' }}
                </g-button>
            </div>
        </div>
    </div>
</transition>
</template>

<script type="text/babel">
import Popup from '@/utils/popup';
import GButton from '@/components/button';
import { addClass, removeClass } from '@/utils/dom';

let typeMap = {
    success: 'success-fill',
    info: 'info-fill',
    warning: 'warn-fill',
    error: 'error-fill'
};

export default {
    name: 'GMessageBox',
    mixins: [ Popup ],
    props: {
        modal: {
            default: true
        },
        lockScroll: {
            default: true
        },
        showClose: {
            type: Boolean,
            default: true
        },
        closeOnClickModal: {
            default: true
        },
        closeOnPressEscape: {
            default: true
        }
    },
    components: {
        GButton
    },
    computed: {
        typeClass() {
            return this.type && typeMap[ this.type ] ? `icon-${ typeMap[this.type] }` : '';
        },
        confirmButtonClasses() {
            return `g-button-primary ${ this.confirmButtonClass }`;
        },
        cancelButtonClasses() {
            return `${ this.cancelButtonClass }`;
        },
        hasParent () {
            return !!this.parent && this.parent instanceof HTMLElement;
        }
    },
    methods: {
        getSafeClose() {
            const currentId = this.uid;
            return () => {
                this.$nextTick( () => {
                    if ( currentId === this.uid ) this.doClose();
                } );
            };
        },
        doClose() {
            if ( !this.visible ) return;
            this.visible = false;
            this._closing = true;
            this.onClose && this.onClose();
            if ( this.lockScroll ) {
                setTimeout( () => {
                    if ( this.modal && this.bodyOverflow !== 'hidden' ) {
                        document.body.style.overflow = this.bodyOverflow;
                        document.body.style.paddingRight = this.bodyPaddingRight;
                    }
                    this.bodyOverflow = null;
                    this.bodyPaddingRight = null;
                }, 200 );
            }
            this.opened = false;
            if ( !this.transition ) {
                this.doAfterClose();
            }
            if ( this.action ) this.callback( this.action, this );
        },
        handleWrapperClick() {
            if ( this.closeOnClickModal ) {
                this.handleAction( 'cancel' );
            }
        },
        handleAction( action ) {
            if ( this.cancelButtonDisabled && action === 'cancel' ) return; // disable右上角的小叉

            this.action = action;
            if ( typeof this.beforeClose === 'function' ) {
                this.close = this.getSafeClose();
                this.beforeClose( action, this, this.close );
            } else {
                this.doClose();
            }
        },
    },
    watch: {
        visible( val ) {
            if ( val ) this.uid++;

            this.$nextTick( () => {
                this.$refs.confirm.$el.focus();
            } );
        }
    },
    data() {
        return {
            uid: 1,
            title: undefined,
            parent: null,
            message: '',
            type: '',
            customClass: '',
            showConfirmButton: true,
            showCancelButton: false,
            action: '',
            confirmButtonText: '',
            cancelButtonText: '',
            confirmButtonDisabled: false,
            cancelButtonDisabled: false,
            confirmButtonType: 'primary',
            cancelButtonType: '',
            confirmButtonLoading: false,
            cancelButtonLoading: false,
            confirmButtonClass: '',
            confirmButtonDisabled: false,
            cancelButtonClass: '',
            editorErrorMessage: null,
            callback: null
        };
    }
};

</script>
<style lang="scss">
@import 'common';

.g-message-box-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;

    &::after {
        content: '';
        display: inline-block;
        height: 100%;
        width: 0;
        vertical-align: middle
    }

    &.private {
        position: absolute;
    }

    .g-message-box {
        text-align: left;
        display: inline-block;
        vertical-align: middle;
        background-color: #fff;
        width: 420px;
        border-radius: 3px;
        font-size: $fontSizeLarge;
        overflow: hidden;

        @media screen and (max-width: 450px) {
            width: 90%;
        }

        .g-message-box-header {
            position: relative;
            padding: 20px 20px 0;

            .g-message-box-close {
                display: inline-block;
                position: absolute;
                top: 19px;
                right: 18px;
                color: #999;
                cursor: pointer;
                line-height: 20px;
                text-align: center;
                font-size: 20px;

                &:hover {
                    color: #20a0ff;
                }

                &.is-disabled, &.is-disabled:hover {
                    color: #bfcbd9;
                    cursor: not-allowed;
                }
            }

            .g-message-box-title {
                padding-left: 0;
                margin-bottom: 0;
                font-size: $fontSizeLarge;
                font-weight: 700;
                height: 18px;
                color: #333
            }
        }

        .g-message-box-content {
            padding: 30px 20px;
            color: #48576a;
            font-size: 14px;
            position: relative;

            .g-message-box-message {
                margin: 0;

                p {
                    margin: 0;
                    line-height: 1.4;
                    word-break: break-all; 
                }
            }

            .g-message-box-status {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                > i{
                    font-size: 36px!important;
                }

                &.info {
                    color: $info;
                }

                &.success {
                    color: $success;
                }

                &.warning {
                    color: $warning;
                }

                &.error {
                    color: $danger;
                }
            }

        }

        .g-message-box-footer {
            padding: 10px 20px 15px;
            text-align: right;

            button:nth-child(2) {
                margin-left: 10px
            }
        }
    }

    &.g-message-box-fade-enter-active {
        animation: g-message-box-fade-in .3s
    }

    &.g-message-box-fade-leave-active {
        animation: g-message-box-fade-out .3s
    }

    @keyframes g-message-box-fade-in {
        0% {
            transform: translate3d(0, -20px, 0);
            opacity: 0
        }
        100% {
            transform: translate3d(0, 0, 0);
            opacity: 1
        }
    }

    @keyframes g-message-box-fade-out {
        0% {
            transform: translate3d(0, 0, 0);
            opacity: 1
        }
        100% {
            transform: translate3d(0, -20px, 0);
            opacity: 0
        }
    }
}
</style>