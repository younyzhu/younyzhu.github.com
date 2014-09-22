/**
 * @author      Yongnan
 * @version     1.0
 * @time        9/21/2014
 * @name        Color.js
 */
function Color( l ) {
    var h = 240;
    var s = 1;
    var r ,g ,b;
    var hue2rgb = function ( p, q, t ) {
        if ( t < 0 ) t += 1;
        if ( t > 1 ) t -= 1;
        if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
        if ( t < 1 / 2 ) return q;
        if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
        return p;
    };
    var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
    var q = ( 2 * l ) - p;
    r = hue2rgb( q, p, h + 1 / 3 );
    g = hue2rgb( q, p, h );
    b = hue2rgb( q, p, h - 1 / 3 );

    this.hexColor = ( r * 255 ) << 16 ^ ( g * 255 ) << 8 ^ ( b * 255 ) << 0;
}
