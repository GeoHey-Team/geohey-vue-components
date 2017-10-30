import { Color } from './color'

// colormap [ [ 100, '#0000FF' ], [ 120, '#00FFFF' ], [ 150, '#00FF00' ], [ 180, '#FFFF00' ],  [ 200, '#FF0000' ] ]
const Lut = function ( colormap, minV, maxV ) {
    this.lut = [];
    this.minV = minV || colormap[ 0 ][ 0 ];
    this.maxV = maxV || colormap[ colormap.length - 1 ][ 0 ];
    this.map = colormap;
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

    changeColorMap: function ( colormap ) {

        return new Lut( colormap, this.minV, this.maxV );

    },

    getColor( alpha ) {

        if ( alpha <= this.minV ) {

            alpha = this.minV;

        } else if ( alpha >= this.maxV ) {

            alpha = this.maxV;

        }

        for ( let j = 0; j < this.map.length - 1; j++ ) {

            let min = this.map[ j ][ 0 ];
            let max = this.map[ j + 1 ][ 0 ];

            if ( alpha >= min && alpha <= max ) {

                let color = new Color();
                let minColor = new Color().setStyle( this.map[ j ][ 1 ] );
                let maxColor = new Color().setStyle( this.map[ j + 1 ][ 1 ] );

                return minColor.lerp( maxColor, ( alpha - min ) / ( max - min ) );

            }

        }

        return null;

    }
}

// colors: [ '#ff0', '#00f', ... ]
const gradient = function ( colors, breaks ) {
    const colormap = colors.map( ( color, index ) => [ index, color ] )
    const length = colors.length
    const lut = new Lut( colormap, 0, length - 1 )

    const result = []

    for ( let i = 0; i <= breaks - 1; i++ ) {
        const alpha = i * length / ( breaks - 1 );
        result.push( lut.getColor( alpha ).getStyle( 'hex' ) )
    }

    return result;
}

export { Lut, gradient }
export default Lut;
