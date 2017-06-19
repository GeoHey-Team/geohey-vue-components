<template>
    <div class="g-color-values">
        <div class="g-color-value" :class="{ 'g-color-value-single': field.length === 1, 'g-color-value-multiple': field.length > 1 }">
            <div class="g-color-input-group" v-for="item in field">
                <input type="text" class="g-color-input" :value="item.v" @input="inputChange( item.k, $event )">
                <p class="g-color-label">{{ item.k }}</p>
            </div>
        </div>
        <!-- <div class="g-color-value g-color-value-multiple">
            <div class="g-color-input-group">
                <input type="text" class="g-color-input">
                <p class="g-color-label">R</p>
            </div>
            <div class="g-color-input-group">
                <input type="text" class="g-color-input">
                <p class="g-color-label">G</p>
            </div>
            <div class="g-color-input-group">
                <input type="text" class="g-color-input">
                <p class="g-color-label">B</p>
            </div>
            <div class="g-color-input-group">
                <input type="text" class="g-color-input">
                <p class="g-color-label">A</p>
            </div>
        </div>
        <div class="g-color-value g-color-value-multiple">
            <div class="g-color-input-group">
                <input type="text" class="g-color-input">
                <p class="g-color-label">H</p>
            </div>
            <div class="g-color-input-group">
                <input type="text" class="g-color-input">
                <p class="g-color-label">S</p>
            </div>
            <div class="g-color-input-group">
                <input type="text" class="g-color-input">
                <p class="g-color-label">L</p>
            </div>
            <div class="g-color-input-group">
                <input type="text" class="g-color-input">
                <p class="g-color-label">A</p>
            </div>
        </div> -->
        <button class="g-color-values-change" @click="changeType">--</button>
    </div>
</template>


<script>
export default {
    name: 'g-color-values',
    props: {
        value: {}
    },
    data () {
        return {
            type: 'hex',
            val: this.value
        }
    },
    computed: {
        allowedTypes () {
            let types = [ 'rgba', 'hsla' ];
            if ( this.val.getAlpha() === 1 ) {
                types.unshift( 'hex' );
            }
            return types;
        },
        field () {

            let type = this.type;

            if ( type === 'hex' ) {

                return [ { k: 'HEX', v: '#' + this.val.getHexString() } ];

            } else if ( type === 'rgba' ) {

                return [
                    { k: 'R', v: this.val.r },
                    { k: 'G', v: this.val.g },
                    { k: 'B', v: this.val.b },
                    { k: 'A', v: this.val.a },
                ]

            } else {

                let hsl = this.val.getHSL();
                let a = this.val.getAlpha();

                return [
                    { k: 'H', v: hsl.h },
                    { k: 'S', v: hsl.s },
                    { k: 'L', v: hsl.l },
                    { k: 'A', v: a },
                ]
            }
        }
    },
    filters: {
        maxFilter: {
            read( val ) {
                if ( this.max && val > this.max ) {
                    return this.max
                } else {
                    return val
                }
            },
            write( val, oldVal ) {
                return val
            }
        }
    },
    methods: {
        update( e ) {
            this.handleChange( e.target.value )
        },
        handleChange( newVal ) {
            let data = {}
            data[ this.label ] = newVal
            this.$emit( 'on-change', data )
        },
        handleBlur( e ) {
            console.log( e )
        },
        handleKeyDown( e ) {
            let val = this.val
            let number = Number( val )
            if ( number ) {
                let amount = this.arrowStep || 1
                    // Up
                if ( e.keyCode === 38 ) {
                    val = number + amount
                    this.handleChange( val )
                    e.preventDefault()
                }
                // Down
                if ( e.keyCode === 40 ) {
                    val = number - amount
                    this.handleChange( val )
                    e.preventDefault()
                }
            }
        },
        handleDrag( e ) {
            console.log( e )
        },
        handleMouseDown( e ) {
            console.log( e )
        },
        changeType () {
            
        }
    }
}

</script>

<style lang="scss">
@import 'common';

.g-color-values {
    width: 100%;
    padding: 10px 44px 10px 10px;
    position: relative;

    .g-color-value {
        width: 100%;

        &::after {
            @include clearfix;
        }

        .g-color-input-group {
            padding: 0 3px;
            text-align: center;
            float: left;

            &:first-child {
                padding-left: 0;
            }

            &:last-child {
                padding-right: 0;
            }

            .g-color-input {
                width: 100%;
                border: 1px solid #ccc;
                border-radius: 3px;
                height: 20px;
                text-align: center;
            }

            .g-color-label {
                color: #999;
                font-size: 13px;
                height: 22px;
                line-height: 22px;
            }
        }

        &.g-color-value-multiple {

            .g-color-input-group {
                width: 25%;
            }
        }

        &.g-color-value-single {

            .g-color-input-group {
                width: 100%;
            }
        }
    }

    .g-color-values-change {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: #fff;
        transition: background .3s;
        cursor: pointer;

        &:hover {
            background: #ddd;
        }
    }
}
</style>