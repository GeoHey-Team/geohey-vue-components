export const DEG2RAD = Math.PI / 180
export const RAD2DEG = 180 / Math.PI

export const generateUUID = (() => {

    // http://www.broofa.com/Tools/Math.uuid.htm

    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
    var uuid = new Array( 36 );
    var rnd = 0,
        r;

    return () => {

        for ( var i = 0; i < 36; i++ ) {

            if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

                    uuid[ i ] = '-';

                } else if ( i === 14 ) {

                    uuid[ i ] = '4';

                } else {

                    if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
                    r = rnd & 0xf;
                    rnd = rnd >> 4;
                    uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

                }

        }

        return uuid.join( '' );

    };

})();

export const clamp = ( value, min, max ) => {

    return Math.max( min, Math.min( max, value ) );

}

// compute euclidian modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation

export const euclideanModulo = ( n, m ) => {

    return ( ( n % m ) + m ) % m;

}

// Linear mapping from range <a1, a2> to range <b1, b2>

export const mapLinear = ( x, a1, a2, b1, b2 ) => {

    return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

}

// http://en.wikipedia.org/wiki/Smoothstep

export const smoothstep = ( x, min, max ) => {

    if ( x <= min ) return 0;
    if ( x >= max ) return 1;

    x = ( x - min ) / ( max - min );

    return x * x * ( 3 - 2 * x );

}

export const smootherstep = ( x, min, max ) => {

    if ( x <= min ) return 0;
    if ( x >= max ) return 1;

    x = ( x - min ) / ( max - min );

    return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

}

// Random integer from <low, high> interval

export const randInt = ( low, high ) => {

    return low + Math.floor( Math.random() * ( high - low + 1 ) );

}

// Random float from <low, high> interval

export const randFloat = ( low, high ) => {

    return low + Math.random() * ( high - low );

}

// Random float from <-range/2, range/2> interval

export const randFloatSpread = ( range ) => {

    return range * ( 0.5 - Math.random() );

}

export const degToRad = ( degrees ) => {

    return degrees * DEG2RAD;

}

export const radToDeg = ( radians ) => {

    return radians * RAD2DEG;

}

const _Math = {
    DEG2RAD,
    RAD2DEG,
    generateUUID,
    clamp,
    euclideanModulo,
    mapLinear,
    smoothstep,
    smootherstep,
    randInt,
    randFloat,
    randFloatSpread,
    degToRad,
    radToDeg
}

export default _Math;
