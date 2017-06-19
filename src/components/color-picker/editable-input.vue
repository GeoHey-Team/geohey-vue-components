<template>
    <div class="g-color-editable-input">
        <input class="g-color-editable-input-input" v-model="val" @keydown="handleKeyDown" @input="update">
        <span class="g-color-editable-input-label">{{label}}</span>
    </div>
</template>


<script>
export default {
    name: 'editableInput',
    props: {
        label: String,
        value: [ String, Number ],
        max: Number,
        min: Number,
        arrowStep: {
            type: Number,
            default: 1
        }
    },
    computed: {
        val() {
            return this.value
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
        }
    }
}

</script>

<style lang="scss">
.g-color-editable-input {
    position: relative;
}
.g-color-editable-input-input {
    padding: 0;
    border: 0;
    outline: none;
    text-align: center;
}
.g-color-editable-input-label {
    text-transform: capitalize;
}
</style>