function Resizer() {

	const dom = this.dom = document.createElement( 'div' );
	dom.id = "resizer";
	const sidebar = document.getElementById( 'sidebar' );

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

		document.body.style.removeProperty( "cursor" );

	}

	function onPointerMove( event ) {

		// PointerEvent's movementX/movementY are 0 in WebKit

		if ( event.isPrimary === false ) return;

		const offsetWidth = document.body.offsetWidth;
		const clientX = event.clientX;

		const cX = clientX < 0 ? 0 : clientX > offsetWidth ? offsetWidth : clientX;

		sidebar.style.width = cX + 'px';

	}

	dom.addEventListener( 'pointerdown', onPointerDown );

	function onWidthChange() {

		const width = sidebar.offsetWidth;

		sidebar.style.width = width + 'px';
		dom.style.left = width + 'px';

	}

	onWidthChange();

	new ResizeObserver( onWidthChange ).observe( sidebar );

}

export { Resizer };
