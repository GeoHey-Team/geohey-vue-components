<template>
    <div class="g-select" :class="[ size, { 'is-disabled': disabled, 'focus': showList } ]" @click.stop>
        <div class="g-select-label-warp" @click="toggleList">
            <span>{{ currentName }}</span>
            <i class="icon" :class="{
                    'icon-arrow-down': !showList,
                    'icon-arrow-up': showList
                }"></i>
        </div>
        <div class="g-select-list-warp" v-show="showList" @wheel.stop>
            <scrollbar :style="menuStyle">
                <ul class="g-select-list" ref="list">
                    <li class="g-select-list-item"
                        v-for="option in options"
                        :class="{ 'active': val === option || val === option.key }"
                        :title="typeof option !== 'object' ? option : option.name"
                        @click="selectItem( option )"> {{ typeof option !== 'object' ? option : option.name }} </li>
                </ul>
            </scrollbar>
        </div>
    </div>
</template>

<script>
import { getSize } from '../../utils/dom'
import Scrollbar from '../scrollbar'

export default {
    name: 'g-dropdown',
    components: {
        Scrollbar
    },
    props: {
        value: {
            default: null
        },
        options: {
            type: Array
        },
        size: String,
        menuMaxHeight: {
            type: Number,
            default: 300
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            val: this.value,
            showList: false
        };
    },
    computed: {
        currentName () {
            if ( !this.options ) return '';
            let selected = this.options.find( item => {
                return typeof item !== 'object' ? item === this.val : item.key === this.val;
            } );

            return typeof selected === 'object' && selected.name ? selected.name : selected;
        },
        menuStyle () {
            if ( this.menuMaxHeight && 26 * this.options.length + 12 > this.menuMaxHeight ) {
                return {
                    height: this.menuMaxHeight + 'px'
                }
            }
            return {};
        }
    },
    watch: {
        value ( val ) {
            this.val = val;
        },
        val () {
            this.$emit( 'input', this.val );
        },
        showList ( val ) {
            if ( val ) {
                document.addEventListener( 'click', this.closeList, false );
            } else {
                document.removeEventListener( 'click', this.closeList, false );
            }
        }
    },
    methods: {
        selectItem ( value ) {

            this.val = typeof value !== 'object' ? value : value.key;
            this.showList = false;

        },
        toggleList () {
            if ( !this.options ) return;
            this.showList = !this.showList;
        },
        closeList () {
            this.showList = false;
        }
    }
}

</script>

<style lang="scss">

@import 'common';

.g-select {
    width: 200px;
    height: 30px;
    line-height: 28px;
    position: relative;
    display: inline-block;
    border-radius: 2px;
    border: 1px solid #d1dbe5;
    font-size: 13px;
    padding: 0 10px;
    transition: border .2s;
    color: #1f2d3d;

    &.small {
        height: 26px;
        line-height: 24px;
    }

    &.large {
        height: 34px;
        line-height: 32px;
    }

    &:hover {
        border-color: #8391a5;
    }

    &.focus {
        border: 1px solid #20a0ff !important;
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
    
    .g-select-label-warp {
        width: 100%;
        height: 100%;
        cursor: pointer;

        > i {
            color: #bfcbd9;
            font-size: 14px;
            position: absolute;
            top: 50%;
            right: 8px;
            transform: translateY(-50%);
            margin-top: 0;
        }

    }

    .g-select-list-warp {
        position: absolute;
        top: 30px;
        line-height: 30px;
        left: 0;
        z-index: 100;
        background: #FFF;
        box-shadow: 0 0 6px 0 rgba(0,0,0,.1), 0 10px 12px 0 rgba(170,182,206,.36);
        padding: 6px 0;
        width: 100%;
        overflow: hidden;
        overflow-y: auto;

        .g-select-list {
            width: 100%;

            .g-select-list-item {
                display: block;
                height: 32px;
                padding: 0 16px;
                white-space: nowrap;
                color: rgba(10,18,32,.64);
                cursor: pointer;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;

                &:hover {
                    color: rgba(10,18,32,.87);
                    background-color: rgba(232,235,237,.6);
                }

                &.active {
                    color: #5182E4;
                }
            }
        }
    }
}

</style>