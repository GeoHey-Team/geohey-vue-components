<template>
    <div class="g-breadcrumb">
        <div class="g-breadcrumb-nav">
            <template v-for="( path, index ) in paths">
                <div class="g-breadcrumb-item" :class="{ 'active': index === paths.length - 1 }">
                    <span>{{ path }}</span>
                </div>
                <div class="g-breadcrumb-separator" v-if="index !== paths.length - 1">
                    <i class="icon icon-arrow-right"></i>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GBreadcrumb',
    props: {
        paths: Array
    }
};

</script>
<style lang="scss">
@import 'common';

.g-breadcrumb {
    margin-bottom: 12px;
    
    &::after {
        @include clearfix();
    }

    .g-breadcrumb-item {
        font-size: 16px;
        color: $fontBlack;
        font-weight: 600;
        float: left;
        letter-spacing: 0;
        height: 25px;
        line-height: 25px;

        &.active {
            color: $fontGray;
            font-weight: 300;
        }
    }

    .g-breadcrumb-separator {
        float: left;
        height: 25px;
        line-height: 25px;
        margin: 0 10px;

        > i {
            font-size: 16px;
        }
    }
}
</style>