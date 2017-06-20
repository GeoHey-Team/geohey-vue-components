<template>
    <transition name="g-message-fade">
        <div
            class="g-message"
            :class="type"
            v-show="visible"
            @click="close"
            @mouseenter="clearTimer"
            @mouseleave="startTimer">
            <div class="g-message-group" :class="{ 'is-with-icon': !!type }">
                <p><i class="g-message-icon iconfont" :class="iconCls"></i>{{ message }}</p>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'GMessage',
    data() {
        return {
            visible: false,
            message: '',
            duration: 3000,
            type: 'info',
            onClose: null,
            closed: false,
            timer: null
        };
    },
    computed: {
        iconCls () {
            return {
                'icon-info-fill': this.type === 'info',
                'icon-success-fill': this.type === 'success',
                'icon-error-fill': this.type === 'error',
                'icon-warn-fill': this.type === 'warning'
            }
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
        close() {
            this.closed = true;
            if ( typeof this.onClose === 'function' ) {
                this.onClose( this );
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
        this.startTimer();
    }
};

</script>

<style lang="scss">
@import 'common';
.g-message {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    min-width: 40px;
    padding: 10px 12px;
    box-sizing: border-box;
    border-radius: 2px;
    position: fixed;
    left: 50%;
    top: 40px;
    z-index: 10000;
    transform: translateX(-50%);
    background-color: #fff;
    transition: opacity .3s, transform .4s;
    overflow: hidden;

    &.info {
        .g-message-icon {
            color: $info;
        }
    }

    &.success {
        .g-message-icon {
            color: $success;
        }
    }

    &.warning {
        .g-message-icon {
            color: $warning;
        }
    }

    &.error {
        .g-message-icon {
            color: $danger;
        }
    }

    .g-message-group {
        position: relative;
        white-space: nowrap;
        height: 20px;
        line-height: 20px;
        overflow: hidden;

        > p {
            margin: 0;
            font-size: $fontSizeBase;
        }

        &.is-with-icon {
            padding-right: 10px;
        }

        .g-message-icon {
            display: inline-block;
            float: left;
            text-align: center;
            font-size: 18px;
            margin: 0 6px;
        }

    }

    &.g-message-fade-enter,
    &.g-message-fade-leave-active {
        opacity: 0;
        transform: translate(-50%, -100%);
    }
}
</style>