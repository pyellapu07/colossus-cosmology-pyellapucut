function Resizer() {

    const dom = document.createElement('div');
    dom.id = "resizer";

    function onPointerDown( event ) {

        if ( event.isPrimary === false ) return;

        event.preventDefault();

        dom.ownerDocument.addEventListener( 'pointermove', onPointerMove );
        dom.ownerDocument.addEventListener( 'pointerup', onPointerUp );

        document.body.style.cursor = "col-resize";

    }

    function onPointerUp( event ) {

        if ( event.isPrimary === false ) return;

        dom.ownerDocument.removeEventListener( 'pointermove', onPointerMove );
        dom.ownerDocument.removeEventListener( 'pointerup', onPointerUp );

        document.body.style.removeProperty("cursor");
    }

    function onPointerMove( event ) {

        // PointerEvent's movementX/movementY are 0 in WebKit

        if ( event.isPrimary === false ) return;

        const offsetWidth = dom.offsetWidth;
        const clientX = event.clientX;

        let x = offsetWidth + clientX;

        if (x <= 200)
            x = 200;
        else if (x >= 400)
            x = 400;

        dom.style.left = x + 'px';

        document.getElementById( 'sidebar' ).style.width = x + 'px';

    }

    dom.addEventListener( 'pointerdown', onPointerDown );

    return dom;
}

export { Resizer };