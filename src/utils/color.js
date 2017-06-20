import { euclideanModulo, clamp } from './math'

function Color( r, g, b, a ) {

    this.r = 1;
    this.g = 1;
    this.b = 1;
    this.a = 1;

    if ( g === undefined && b === undefined ) {

        // r is Color, hex or string
        return this.set( r );

    }

    return this.setRGBA( r, g, b, a );

}

Object.assign( Color.prototype, {

    isColor: true,

    set: function ( value ) {

        if ( value && value.isColor ) {

            this.copy( value );

        } else if ( typeof value === 'number' ) {

            this.setHex( value );

        } else if ( typeof value === 'string' ) {

            this.setStyle( value );

        }

        return this;

    },

    setAlpha: function ( a ) {

        this.a = a;

        return this;

    },

    setHex: function ( hex ) {

        hex = Math.floor( hex );

        this.r = ( hex >> 16 & 255 ) / 255;
        this.g = ( hex >> 8 & 255 ) / 255;
        this.b = ( hex & 255 ) / 255;

        return this;

    },

    setRGB: function ( r, g, b ) {

        this.r = r;
        this.g = g;
        this.b = b;

        return this;

    },

    setRGBA: function ( r, g, b, a = 1 ) {

        this.setRGB( r, g, b );
        this.a = a;

        return this;

    },

    setHSL: function () {

        function hue2rgb( p, q, t ) {

            if ( t < 0 ) t += 1;
            if ( t > 1 ) t -= 1;
            if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
            if ( t < 1 / 2 ) return q;
            if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
            return p;

        }

        return function setHSL( h, s, l ) {

            // h,s,l ranges are in 0.0 - 1.0
            h = euclideanModulo( h, 1 );
            s = clamp( s, 0, 1 );
            l = clamp( l, 0, 1 );

            if ( s === 0 ) {

                this.r = this.g = this.b = l;

            } else {

                var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
                var q = ( 2 * l ) - p;

                this.r = hue2rgb( q, p, h + 1 / 3 );
                this.g = hue2rgb( q, p, h );
                this.b = hue2rgb( q, p, h - 1 / 3 );

            }

            return this;

        };

    }(),

    setHSV: function ( h, s, v ) {

        h = euclideanModulo( h, 1 );
        s = clamp( s, 0, 1 );
        v = clamp( v, 0, 1 );

        var hsl = {};

        hsl.h = h;
        hsl.s = ( s * v ) / ( ( h = ( 2 - s ) * v ) < 1 ? h : ( 2 - h ) );
        hsl.l = h * 0.5;

        // TODO
        if ( isNaN( hsl.s ) ) {
            hsl.l -= 1e-6;
            hsl.s = hsl.l + 1e-6;
        }

        this.setHSL( hsl.h, hsl.s, hsl.l );

        return this;

    },

    setStyle: function ( style ) {

        function handleAlpha( string ) {

            if ( string === undefined ) return;

            if ( parseFloat( string ) < 1 ) {

                this.a = parseFloat( string );

            }

        }


        var m;

        if ( m = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec( style ) ) {

            // rgb / hsl

            var color;
            var name = m[ 1 ];
            var components = m[ 2 ];

            switch ( name ) {

                case 'rgb':
                case 'rgba':

                    if ( color = /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

                        // rgb(255,0,0) rgba(255,0,0,0.5)
                        this.r = Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255;
                        this.g = Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255;
                        this.b = Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255;

                        handleAlpha( color[ 5 ] );

                        return this;

                    }

                    if ( color = /^(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

                        // rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
                        this.r = Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100;
                        this.g = Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100;
                        this.b = Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100;

                        handleAlpha( color[ 5 ] );

                        return this;

                    }

                    break;

                case 'hsl':
                case 'hsla':

                    if ( color = /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

                        // hsl(120,50%,50%) hsla(120,50%,50%,0.5)
                        var h = parseFloat( color[ 1 ] ) / 360;
                        var s = parseInt( color[ 2 ], 10 ) / 100;
                        var l = parseInt( color[ 3 ], 10 ) / 100;

                        handleAlpha( color[ 5 ] );

                        return this.setHSL( h, s, l );

                    }

                    break;

            }

        } else if ( m = /^\#([A-Fa-f0-9]+)$/.exec( style ) ) {

            // hex color

            var hex = m[ 1 ];
            var size = hex.length;

            if ( size === 3 ) {

                // #ff0
                this.r = parseInt( hex.charAt( 0 ) + hex.charAt( 0 ), 16 ) / 255;
                this.g = parseInt( hex.charAt( 1 ) + hex.charAt( 1 ), 16 ) / 255;
                this.b = parseInt( hex.charAt( 2 ) + hex.charAt( 2 ), 16 ) / 255;

                return this;

            } else if ( size === 6 ) {

                // #ff0000
                this.r = parseInt( hex.charAt( 0 ) + hex.charAt( 1 ), 16 ) / 255;
                this.g = parseInt( hex.charAt( 2 ) + hex.charAt( 3 ), 16 ) / 255;
                this.b = parseInt( hex.charAt( 4 ) + hex.charAt( 5 ), 16 ) / 255;

                return this;

            }

        }

        if ( style && style.length > 0 ) {

            console.warn( 'Color: Unknown color ' + style );

        }

        return this;

    },

    clone: function () {

        return new this.constructor( this.r, this.g, this.b, this.a );

    },

    copy: function ( color ) {

        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;

        return this;

    },

    getAlpha: function () {

        return this.a;

    },

    getHex: function () {

        let r = Math.round( this.r * 255 );
        let g = Math.round( this.g * 255 );
        let b = Math.round( this.b * 255 );

        return r << 16 ^ g << 8 ^ b << 0;

    },

    getHexString: function () {

        return ( '000000' + this.getHex().toString( 16 ) ).slice( -6 );

    },

    getHSL: function ( optionalTarget ) {

        // h,s,l ranges are in 0.0 - 1.0

        var hsl = optionalTarget || { h: 0, s: 0, l: 0 };

        var r = this.r,
            g = this.g,
            b = this.b;

        var max = Math.max( r, g, b );
        var min = Math.min( r, g, b );

        var hue, saturation;
        var lightness = ( min + max ) / 2.0;

        if ( min === max ) {

            hue = 0;
            saturation = 0;

        } else {

            var delta = max - min;

            saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );

            switch ( max ) {

                case r:
                    hue = ( g - b ) / delta + ( g < b ? 6 : 0 );
                    break;
                case g:
                    hue = ( b - r ) / delta + 2;
                    break;
                case b:
                    hue = ( r - g ) / delta + 4;
                    break;

            }

            hue /= 6;

        }

        hsl.h = hue;
        hsl.s = saturation;
        hsl.l = lightness;
        hsl.a = this.a;

        return hsl;

    },

    getHSV: function ( optionalTarget ) {

        var hsv = optionalTarget || { h: 0, s: 0, v: 0 };

        var hsl = this.getHSL();

        // based on https://gist.github.com/xpansive/1337890#file-index-js
        hsl.s *= ( hsl.l < 0.5 ) ? hsl.l : ( 1 - hsl.l );

        hsv.h = hsl.h;
        hsv.s = 2 * hsl.s / ( hsl.l + hsl.s );
        hsv.v = hsl.l + hsl.s;
        hsv.a = this.a;

        return hsv;

    },

    getStyle: function ( format = 'rgba' ) {

        if ( format === 'hsl' || format === 'hsla' ) {

            let hsl = this.getHSL();

            let hslStr = `${ Math.round( hsl.h * 360 ) }, ${ Math.round( hsl.s * 100 ) }%, ${ Math.round( hsl.l * 100 ) }%`;

            if ( format === 'hsla' ) return `hsla( ${ hslStr }, ${ this.a } )`;

            return `hsl( ${ hslStr } )`;

        } else if ( format === 'rgb' || format === 'rgba' ) {

            let rgbStr = `${ Math.round( this.r * 255 ) }, ${ Math.round( this.g * 255 ) }, ${ Math.round( this.b * 255 ) }`;

            if ( format === 'rgba' ) return `rgba( ${ rgbStr }, ${ this.a } )`;

            return `rgb( ${ rgbStr } )`;

        } else if ( format === 'hex' ) {

            return `#${ this.getHexString() }`;

        }

        return null;

    }

} );


const color = ( r, g, b, a ) => {
    return new Color( r, g, b, a );
}

export { Color, color }
export default color;
