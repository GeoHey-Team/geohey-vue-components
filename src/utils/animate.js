import TWEEN from 'tween.js'

let playing = false;

function animateLoop () {

    playing = true;

    if ( TWEEN.update() ) {

        requestAnimationFrame( animateLoop );

    } else {

        playing = false;

    }
}

export const Easing = TWEEN.Easing;

export const animate = ( animateObject, endValues, duration = 300, callbacks, easing ) => {

    let tween = new TWEEN.Tween( animateObject ).to( endValues, duration );

    if ( easing ) {
        // tween.easing( easing )
    }

    for ( const key in callbacks ) {
        tween[ key ]( callbacks[ key ] )
    }

    tween.start();

    if ( !playing ) {
        animateLoop();
    }

}