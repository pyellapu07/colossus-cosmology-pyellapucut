function Resizer() {

    const dom = document.createElement('div');
    dom.id = "resizer";

    function onPointerDown( event ) {

        if ( event.isPrimary === false ) return;

        event.preventDefault();

        dom.ownerDocument.addEventListener( 'pointermove', onPointerMove );
        dom.ownerDocument.addEventListener( 'pointerup', onPointerUp );

    }

    function onPointerUp( event ) {

        if ( event.isPrimary === false ) return;

        dom.ownerDocument.removeEventListener( 'pointermove', onPointerMove );
        dom.ownerDocument.removeEventListener( 'pointerup', onPointerUp );

    }

    function onPointerMove( event ) {

        // PointerEvent's movementX/movementY are 0 in WebKit

        if ( event.isPrimary === false ) return;

        const offsetWidth = dom.offsetWidth;
        const clientX = event.clientX;

        const x = offsetWidth + clientX;

        dom.style.left = x + 'px';

        document.getElementById( 'sidebar' ).style.width = x + 'px';

    }

    dom.addEventListener( 'pointerdown', onPointerDown );

    return dom;
}

export { Resizer };