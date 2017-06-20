<template>
    <transition name="g-notification-fade">
        <div
            class="g-notification"
            :class="[ type, { 'is-only-title': !message } ]"
            v-show="visible"
            :style="{ top: top ? top + 'px' : 'auto' }"
            @mouseenter="clearTimer()"
            @mouseleave="startTimer()"
            @click="click">
            <i
                class="g-notification-icon iconfont"
                :class="typeClass"
                v-if="type">
            </i>
            <div class="g-notification-group" :class="{ 'is-with-icon': typeClass || iconClass }">
                <h2 class="g-notification-title" v-text="title"></h2>
                <div class="g-notification-content"><slot>{{ message }}</slot></div>
                <div class="g-notification-close iconfont icon-close" @click.stop="close"></div>
            </div>
        </div>
    </transition>
</template>

<script>
let typeMap = {
    success: 'success-fill',
    info: 'info-fill',
    warning: 'warn-fill',
    error: 'error-fill'
};
export default {
    name: 'GNotification',
    data() {
        return {
            visible: false,
            title: '',
            message: '',
            duration: 4000,
            type: '',
            onClose: null,
            onClick: null,
            closed: false,
            top: null,
            timer: null
        };
    },
    computed: {
        typeClass() {
            return this.type && typeMap[ this.type ] ? `icon-${ typeMap[this.type] }` : '';
        }
    },
    watch: {
        closed( newVal ) {
            if ( newVal ) {
                this.visible = false;
                this.$el.addEventListener( 'transitionend', this.destroyElement );
            }
        }
    },
    methods: {
        destroyElement() {
            this.$el.removeEventListener( 'transitionend', this.destroyElement );
            this.$destroy( true );
            this.$el.parentNode.removeChild( this.$el );
        },
        click() {
            if ( typeof this.onClick === 'function' ) {
                this.onClick();
            }
        },
        close() {
            this.closed = true;
            if ( typeof this.onClose === 'function' ) {
                this.onClose();
            }
        },
        clearTimer() {
            clearTimeout( this.timer );
        },
        startTimer() {
            if ( this.duration > 0 ) {
                this.timer = setTimeout( () => {
                    if ( !this.closed ) {
                        this.close();
                    }
                }, this.duration );
            }
        }
    },
    mounted() {
        if ( this.duration > 0 ) {
            this.timer = setTimeout( () => {
                if ( !this.closed ) {
                    this.close();
                }
            }, this.duration );
        }
    }
};

</script>
<style lang="scss">
@import 'common';

.g-notification {
    width: 330px;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 2px;
    position: fixed;
    right: 16px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    transition: opacity .3s, transform .3s, right .3s, top .4s;
    overflow: hidden;
    border-left: 3px solid transparent;

    @media screen and (max-width: 450px) {
        width: 90%;
    }

    &.info {
        border-color: $info;
        .g-notification-icon {
            color: $info;
        }
    }

    &.success {
        border-color: $success;
        .g-notification-icon {
            color: $success;
        }
    }

    &.warning {
        border-color: $warning;
        .g-notification-icon {
            color: $warning;
        }
    }

    &.error {
        border-color: $danger;
        .g-notification-icon {
            color: $danger;
        }
    }

    .g-notification-icon {
        width: 40px;
        height: 40px;
        font-size: 40px;
        float: left;
        position: relative;
        top: 3px;
    }

    .g-notification-group {
        margin-left: 0;
        &.is-with-icon {
            margin-left: 55px
        }

        .g-notification-title {
            font-weight: 400;
            font-size: 16px;
            color: #1f2d3d;
            margin: 0;
        }

        .g-notification-content {
            font-size: 14px;
            line-height: 21px;
            margin: 10px 0 0;
            color: #8391a5;
            text-align: justify;
        }

        .g-notification-close {
            top: 20px;
            right: 20px;
            position: absolute;
            cursor: pointer;
            color: #bfcbd9;
            font-size: 14px;

            &:hover {
                color: #97a8be;
            }
        }
    }

    &.is-only-title {
        height: 36px;
        line-height: 24px;
        padding: 6px 20px;

        .g-notification-icon {
            font-size: 16px;
            width: 24px;
            height: 24px;
            line-height: 24px;
            top: 1px;
        }

        .g-notification-group { 
            margin-left: 20px !important;
            .g-notification-title {
                font-size: 14px;
            }

            .g-notification-close {
                top: 8px;
                right: 10px;
            }
        }
    }

    &.g-notification-fade-enter,
    &.g-notification-fade-leave-active {
        transform: translateX(100%);
        right: 0;
    }
}
</style>