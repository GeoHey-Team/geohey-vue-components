<template>
    <div class="g-color-bar-picker">
        <div class="color-bar-panel-list" v-if="!editPanelVisible">
            <div class="color-bar-current" :class="[ type ]">
                <color-bar :colors="selectedColors"></color-bar>
                <div class="color-bar-alpha" v-if="type === 'alpha'">
                    <alpha v-model="alphaColor" size="small"></alpha>
                </div>
            </div>
            <div class="color-bar-list-box">
                <g-scrollbar class="color-bar-list-wrapper">
                    <ul class="color-bar-list">
                        <li v-for="( colors, index ) in colorBars"
                            :class="{ 'active': selected === index }"
                            :key="index" 
                            @click="select( index )">
                            <color-bar :colors="colors"></color-bar>
                            <i class="color-bar-icon icon icon-exchange"
                                @click.stop="reverse( index )"></i>
                        </li>
                    </ul>
                </g-scrollbar>
                <div class="custom-color-bar" v-show="customizable">
                    <div class="custom-color-bar-box" :class="{ 'active': selected === -1 }" @click.stop="select( -1 )" v-if="customColors.length > 0">
                        <color-bar :colors="customColors"></color-bar>
                        <i class="color-bar-icon icon icon-close" @click.stop="cleanCustomColor"></i>
                    </div>
                    <p v-else @click.stop="edit">自定义色带</p>
                </div>
            </div>
        </div>
        <div class="color-bar-panel-edit" v-if="editPanelVisible">
            <div class="color-bar-current">
                <color-bar :colors="customColors" @on-select="editColor"></color-bar>
                <div class="edit-pointer" :style="pointerStyle"></div>
                <i class="color-bar-icon icon icon-check" @click="confirm"></i>
            </div>
            <color-picker hide-preset :value="editedColor" @input="changeColor" :hideAlpha="type === 'alpha' "></color-picker>
        </div>
    </div>
</template>

<script>
import ColorBar from './color-bar'
import GScrollbar from '../scrollbar'
import Slider from '../slider'
import Alpha from '../color-picker/alpha'
import { gradient } from '@/utils/lut'
import ColorPicker from '../color-picker'
import Vue from 'vue'

const presetcolor = [
    [ '#5182e4', '#ce62d6', '#9bcc66', '#8954d4', '#3fb27e', '#5156b8', '#f7cb4a', '#51b4f1', '#f88d48', '#69d4db', '#f35352', '#d42d6b' ],
    [ '#4a72c9',  '#4966b7',  '#33418e',  '#479ce2',  '#78a9f2',  '#7560bf',  '#a3ccf8',  '#47b8e2',  '#89a0d3',  '#6087bf' ], 
    [ '#006bc2', '#4d8cae', '#ff8500', '#72c8f2', '#0fa8e0', '#ffbf9a', '#2b5b75', '#b6d0de', '#324598', '#dce292', '#ad5600', '#80adc5' ], 
    [ '#a1cb80', '#8b736e', '#3d8a6f', '#739e90', '#ffcd5d', '#245443', '#c74a66', '#4294b8', '#42a4b8', '#75b55e' ], 
    [ '#b7d62d', '#eb4b5c', '#8d9e69', '#d6d6d7', '#67b9cd', '#a4ded9', '#8ac98b' ], 
    [ '#7260af', '#a563ac', '#d3c3db', '#a999c9', '#daa6d6' ],
    [ '#ffc6c4', '#f4a3a8', '#e38191', '#cc607d', '#ad466c', '#8b3058', '#672044' ],
    [ '#fbe6c5', '#f5ba98', '#ee8a82', '#dc7176', '#c8586c', '#9c3f5d', '#70284a' ],
    [ '#f6d2a9', '#f5b78e', '#f19c7c', '#ea8171', '#dd686c', '#ca5268', '#b13f64' ],
    [ '#ecda9a', '#efc47e', '#f3ad6a', '#f7945d', '#f97b57', '#f66356', '#ee4d5a' ],
    [ '#fde0c5', '#facba6', '#f8b58b', '#f59e72', '#f2855d', '#ef6a4c', '#eb4a40' ],
    [ '#fef6b5', '#ffdd9a', '#ffc285', '#ffa679', '#fa8a76', '#f16d7a', '#e15383' ],
    [ '#e4f1e1', '#b4d9cc', '#89c0b6', '#63a6a0', '#448c8a', '#287274', '#0d585f' ],
    [ '#c4e6c3', '#96d2a4', '#6dbc90', '#4da284', '#36877a', '#266b6e', '#1d4f60' ],
    [ '#d2fbd4', '#a5dbc2', '#7bbcb0', '#559c9e', '#3a7c89', '#235d72', '#123f5a' ],
    [ '#d3f2a3', '#97e196', '#6cc08b', '#4c9b82', '#217a79', '#105965', '#074050' ],
    [ '#f7feae', '#b7e6a5', '#7ccba2', '#46aea0', '#089099', '#00718b', '#045275' ],
    [ '#d1eeea', '#a8dbd9', '#85c4c9', '#68abb8', '#4f90a6', '#3b738f', '#2a5674' ],
    [ '#b0f2bc', '#89e8ac', '#67dba5', '#4cc8a3', '#38b2a3', '#2c98a0', '#257d98' ],
    [ '#f3e0f7', '#e4c7f1', '#d1afe8', '#b998dd', '#9f82ce', '#826dba', '#63589f' ],
    [ '#f9ddda', '#f2b9c4', '#e597b9', '#ce78b3', '#ad5fad', '#834ba0', '#573b88' ],
    [ '#f3e79b', '#fac484', '#f8a07e', '#eb7f86', '#ce6693', '#a059a0', '#5c53a5' ],
    [ '#f3cbd3', '#eaa9bd', '#dd88ac', '#ca699d', '#b14d8e', '#91357d', '#6c2167' ],
    [ '#fcde9c', '#faa476', '#f0746e', '#e34f6f', '#dc3977', '#b9257a', '#7c1d6f' ],
    [ '#ede5cf', '#e0c2a2', '#d39c83', '#c1766f', '#a65461', '#813753', '#541f3f' ],
    [ '#798234', '#a3ad62', '#d0d3a2', '#fdfbe4', '#f0c6c3', '#df91a3', '#d46780' ],
    [ '#3d5941', '#778868', '#b5b991', '#f6edbd', '#edbb8a', '#de8a5a', '#ca562c' ],
    [ '#008080', '#70a494', '#b4c8a8', '#f6edbd', '#edbb8a', '#de8a5a', '#ca562c' ],
    [ '#009392', '#39b185', '#9ccb86', '#e9e29c', '#eeb479', '#e88471', '#cf597e' ],
    [ '#009392', '#72aaa1', '#b1c7b3', '#f1eac8', '#e5b9ad', '#d98994', '#d0587e' ],
    [ '#009B9E', '#42B7B9', '#A7D3D4', '#F1F1F1', '#E4C1D9', '#D691C1', '#C75DAB' ],
    [ '#A16928', '#bd925a', '#d6bd8d', '#edeac2', '#b5c8b8', '#79a7ac', '#2887a1' ],
    [ '#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#005a32' ],
    [ '#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84' ],
    [ '#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026' ],
    [ '#ffffd4', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#8c2d04' ],
    [ '#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#4a1486' ],
    [ '#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594' ],
    [ '#f7f7f7', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525' ],
    [ '#8c510a', '#d8b365', '#f6e8c3', '#f5f5f5', '#c7eae5', '#5ab4ac', '#01665e' ],
    [ '#762a83', '#af8dc3', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#7fbf7b', '#1b7837' ],
    [ '#c51b7d', '#e9a3c9', '#fde0ef', '#f7f7f7', '#e6f5d0', '#a1d76a', '#4d9221' ],
    [ '#d53e4f', '#fc8d59', '#fee08b', '#ffffbf', '#e6f598', '#99d594', '#3288bd' ],
    [ '#d73027', '#fc8d59', '#fee08b', '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850' ],
]

export default {
    name: 'g-color-bar-picker',
    components: {
        ColorBar,
        GScrollbar,
        ColorPicker,
        Alpha,
        Slider
    },
    props: {
        type: {
            type: String,
            default: 'default'
        },
        customizable: {
            type: Boolean,
            default: true
        },
        colors: {
            type: Array,
            default () {
                return presetcolor
            }
        },
        breaks: {
            type: Number
        },
        value: {
            type: Array,
            default () {
                return []
            }
        },
        alpha: {
            type: Number,
            default: 1
        }
    },
    created () {
        this.colorBars = this.colorBuckets;

        this.update();

        if ( this.selected === -1 && this.customColors && this.customColors.length > 0 && this.breaks !== undefined ) {
            this.customColors = gradient( this.customColors, this.breaks );
            this.$emit( 'input', [ ...this.customColors ] );
        }
    },
    computed: {
        colorBuckets () {
            if ( this.breaks === undefined ) return this.colors;

            return this.colors.map( item => gradient( item, this.breaks ) )
        },
        selectedColors () {
            if ( this.selected === -1 ) return this.customColors;
            return this.colorBars[ this.selected ] || []
        },
        editedColor () {
            return this.customColors[ this.edited ];
        },
        pointerStyle () {
            const itemWidth = 176 / this.customColors.length;
            return {
                width: itemWidth + 'px',
                left: 16 + this.edited * itemWidth + 'px'
            }
        },
        alphaColor: {
            get () {
                return {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: this.a
                }
            },
            set ( val ) {
                this.a = val.a;
                this.$emit( 'input-alpha', this.alpha )
            }
        }
    },
    data () {
        return {
            customColors: [],
            editPanelVisible: false,
            colorBars: this.colorBuckets,
            selected: 0,
            edited: 0,
            a: this.alpha
        }
    },
    watch: {
        colors ( val ) {
            this.colorBars = this.colorBuckets;
            this.update();
        },
        breaks ( val ) {
            this.colorBars = this.colorBuckets;

            if ( this.customColors && this.customColors.length > 0 ) {
                this.customColors = gradient( this.customColors, this.breaks );
            }
            this.$emit( 'input', [ ...this.selectedColors ] );
            // this.update();
        },
        value: {
            deep: true,
            handler () {
                this.update();
            }
        },
        alpha () {
            this.a = this.alpha;
        },
        customColors ( val ) {
            if ( this.breaks !== undefined && val && val.length > 0 && val.length !== this.breaks ) {
                this.customColors = gradient( this.customColors, this.breaks );
            }
            // if ( val && this.selected === -1 && val.length > 0 ) {
            //     // this.$emit( 'input', [ ...this.customColors ] )
            // }
        }
    },
    methods: {
        update () {

            let index = this.colorBars.findIndex( ( colors, index ) => {

                if ( colors.length !== this.value.length ) return false;

                if ( colors.every( ( item, index ) => item === this.value[ index ] ) ) return true;

                if ( colors.every( ( item, index ) => item === this.value[ colors.length - index - 1 ] ) ) {
                    this.colorBars[ index ].reverse();
                    return true;
                }

                return false;

            } )

            if ( index === -1 ) {
                this.customColors = [ ...this.value ];
                this.selected = -1;
            } else {
                this.selected = index;
            }
        },
        select ( index ) {
            if ( this.selected !== index ) {
                this.selected = index;
                this.$emit( 'input', [ ...this.selectedColors ] )
            } else {
                this.edit();
            }
        },
        reverse ( index ) {
            this.selected = index;
            this.colorBars[ index ].reverse();
            this.$emit( 'input', [ ...this.selectedColors ] )
        },
        edit () {
            this.customColors = [ ...this.selectedColors ];
            this.editPanelVisible = true;
        },
        cleanCustomColor () {
            this.selected = 0;
            this.customColors = [];
        },
        editColor ( event ) {
            this.edited = event.index;
        },
        changeColor ( color ) {
            Vue.set( this.customColors, this.edited, color )
        },
        confirm () {
            this.selected = -1;
            this.editPanelVisible = false;
            this.$emit( 'input', [ ...this.selectedColors ] )
        }
    }
}

</script>
<style lang="scss">
@import 'common';

.g-color-bar-picker {
    width: 230px;
    position: relative;
    z-index: 10;
    box-shadow: 0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15);

    .color-bar-icon {
        position: absolute;
        right: 10px;
        top: 8px;
        display: block;
        text-align: center;
        width: 20px;
        height: 20px;
        line-height: 20px;
        color: $primary;
        cursor: pointer;
    }
    
    .color-bar-panel-list {
        width: 100%;
        position: relative;

        .color-bar-current {
            width: 100%;
            border-bottom: 1px solid #ddd;
            background: #f2f6f9;

            &.alpha {
                .color-bar {
                    height: 26px;
                    padding-bottom: 0;
                }
            }

            .color-bar-alpha {
                width: 100%;
                height: 6px;
                position: relative;
                padding: 0 16px;
                margin: 10px 0;

                .g-color-picker-c-alpha {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .color-bar-list-box {
            width: 100%;
            height: 185px;
            background: #fff;
            overflow: hidden;

            .color-bar-list-wrapper {
                display: block;
                width: 100%;
                height: 148px;
                overflow: hidden;

                .vue-scrollbar__scrollbar-vertical {
                    width: 4px;
                    opacity: 0.4;

                    &:hover {
                        opacity: 1;
                        width: 10px;
                    }
                }

                .color-bar-list {
                    display: block;
                    width: 100%;

                    > li {
                        cursor: pointer;
                        display: block;
                        position: relative;
                        border-bottom: 1px solid #eee;
                        padding-right: 22px;

                        > i {
                            display: none;
                        }

                        &:hover {
                            background: rgba( $primary, .1 );
                            > i {
                                display: block;
                            }
                        }

                        &.active {
                            &::before {
                                content: '';
                                display: block;
                                position: absolute;
                                // z-index: -1;
                                top: 9px;
                                bottom: 9px;
                                left: 10px;
                                right: 32px;
                                border: 1px solid rgba(17, 129, 251, 0.64);
                                border-radius: 8px;
                                background: rgba(17, 129, 251, 0.08);
                            }
                        }
                    }
                }

            }

            .custom-color-bar {
                position: relative;
                height: 36px;
                line-height: 36px;
                font-size: 12px;
                text-align: center;
                color: $primary;
                cursor: pointer;
                border-top: 1px solid #ddd;
                padding-right: 22px;

                .custom-color-bar-box {
                    &.active {
                        &::before {
                            content: '';
                            display: block;
                            position: absolute;
                            // z-index: -1;
                            top: 9px;
                            bottom: 9px;
                            left: 10px;
                            right: 32px;
                            border: 1px solid rgba(17, 129, 251, 0.64);
                            border-radius: 8px;
                            background: rgba(17, 129, 251, 0.08);
                        }
                    }
                }

                > p {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
            }
        }

    }

    .color-bar-panel-edit {
        .color-bar-current {
            position: relative;
            width: 100%;
            border-bottom: 1px solid #ddd;
            background: #fff;
            padding-right: 22px;

            .edit-pointer {
                height: 1px;
                background: #000;
                position: absolute;
                bottom: 0;
            }

            .edit-confirm {
                position: absolute;
                right: 10px;
                top: 8px;
                display: block;
                text-align: center;
                width: 20px;
                height: 20px;
                line-height: 20px;
                color: $primary;
                cursor: pointer;
            }
        }
    }

}

</style>