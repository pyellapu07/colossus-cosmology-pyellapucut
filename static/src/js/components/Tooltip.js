class Tooltip {

	constructor( element, text, left = false, bottom = false ) {

		const tooltip = this.dom = document.createElement( 'div' );

		tooltip.classList.add( 'tooltip-content' );

		if ( left )
			tooltip.classList.add( 'left' );
		if ( bottom )
			tooltip.classList.add( 'bottom' );

		tooltip.innerHTML = text;

		element.tabIndex = 0;
		element.classList.add( 'tooltip' );
		element.appendChild( tooltip );

	}

}

export { Tooltip };
