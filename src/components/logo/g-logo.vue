<template>
    <div class="g-logo">
        <div class="g-logo-wrap"><div class="g-logo-waves" :style="wavesStyle"></div><a :href="href" target="_blank"><img src="../../assets/geohey.png" alt="" @mouseover="onMouseOver" @mouseout="onMouseOut">
            </a>
        </div>
    </div>
</template>

<script>

export default {
    name: 'g-logo',
    props: {
        href: {
            type: String,
            default: 'http://geohey.com'
        },
        src: {
            type: String
        }
    },
    data () {
        return {
            mouseover: false
        }
    },
    computed: {
        wavesStyle () {
            let scale = this.mouseover ? 3 : 1;
            return `transform: scale( ${ scale }, ${ scale } )`;
        }
    },
    methods: {
        onMouseOver () {
            this.mouseover = true;
        },
        onMouseOut () {
            this.mouseover = false;
        }
    }
}

</script>

<style lang="scss">

@import 'common';

.g-logo {
    @include reset;
    width: 68px;
    height: 68px;

    .g-logo-wrap {
        position: absolute;
        left: -26px;
        top: -26px;
        width: 120px;
        height: 120px;
        // line-height: 120px;
        text-align: center;

        &::after {
            content: '';
            display: inline-block;
            height: 100%;
            width: 0;
            vertical-align: middle;
        }

        .g-logo-waves {
            display: inline-block;
            vertical-align: middle;
            width: 32px;
            height: 32px;
            background: #fff;
            border-radius: 50%;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1);
            background: #fff;

        }

        img {
            position: absolute;
            z-index: 10;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 24px;
            height: 24px;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1);
            
            &:hover {
                width: 32px;
                height: 32px;
            }
        }
    }
}

</style>