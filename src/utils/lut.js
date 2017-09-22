import { Color } from './color'

// colormap [ [ 100, '#0000FF' ], [ 120, '#00FFFF' ], [ 150, '#00FF00' ], [ 180, '#FFFF00' ],  [ 200, '#FF0000' ] ]
const Lut = function ( colormap, numberofcolors, minV, maxV ) {
    this.lut = [];
    this.n = numberofcolors;
    this.minV = minV || colormap[ 0 ][ 0 ];
    this.maxV = maxV || colormap[ colormap.length - 1 ][ 0 ];
    this.map = colormap;

    let step = 1.0 / this.n;
    let value;

    for ( let i = 0; i <= 1; i += step ) {

        value = this.minV + i * ( this.maxV - this.minV );

        for ( let j = 0; j < this.map.length - 1; j++ ) {

            let min = this.map[ j ][ 0 ];
            let max = this.map[ j + 1 ][ 0 ];

            if ( value >= min && value < max ) {

                let color = new Color();
                let minColor = new Color().setStyle( this.map[ j ][ 1 ] );
                let maxColor = new Color().setStyle( this.map[ j + 1 ][ 1 ] );

                color = minColor.lerp( maxColor, ( value - min ) / ( max - min ) );

                this.lut.push( color );

            }

        }

    }
}

Lut.prototype = {

    setMin: function ( min ) {

        this.minV = min;

        return this;

    },

    setMax: function ( max ) {

        this.maxV = max;

        return this;

    },

    changeNumberOfColors: function ( numberofcolors ) {

        this.n = numberofcolors;

        return new Lut( this.mapname, this.n, this.minV, this.maxV );

    },

    changeColorMap: function ( colormap ) {

        return new Lut( colormap, this.n, this.minV, this.maxV );

    },

    getColor( alpha ) {

        if ( alpha <= this.minV ) {

            alpha = this.minV;

        } else if ( alpha >= this.maxV ) {

            alpha = this.maxV;

        }

        alpha = ( alpha - this.minV ) / ( this.maxV - this.minV );

        let colorPosition = Math.round( alpha * this.n );
        colorPosition == this.n ? colorPosition -= 1 : colorPosition;

        return this.lut[ colorPosition ];

    }
}

// colors: [ '#ff0', '#00f', ... ]
const gradient = function ( colors, breaks ) {
    const colormap = colors.map( ( color, index ) => [ index, color ] )
    const length = colors.length - 1
    const lut = new Lut( colormap, breaks, 0, length )

    const result = []

    for ( let i = 0; i < breaks; i++ ) {
        const alpha = i * length / breaks;
        result.push( lut.getColor( alpha ).getStyle( 'hex' ) )
    }

    return result;
}


export { Lut, gradient }
export default Lut;
