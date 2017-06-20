export const format = ( date, formatStr = 'Y-M-D h:m:s' ) => {
    if ( typeof date === 'string' || typeof date === 'number' ) date = new Date( date );
    let Y = date.getFullYear();
    let M = date.getMonth() + 1;
    let D = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    let result = formatStr
                    .replace( 'Y', Y )
                    .replace( 'MM', M < 10 ? '0' + M : M )
                    .replace( 'M', M )
                    .replace( 'DD', D < 10 ? '0' + D : D )
                    .replace( 'D', D )
                    .replace( 'hh', h < 10 ? '0' + h : h )
                    .replace( 'h', h )
                    .replace( 'mm', m < 10 ? '0' + m : m )
                    .replace( 'm', m )
                    .replace( 'ss', s < 10 ? '0' + s : s )
                    .replace( 's', s );

    return result;
}