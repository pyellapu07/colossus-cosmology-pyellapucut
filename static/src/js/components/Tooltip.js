class Tooltip {

	constructor( element, text, left = false, bottom = false ) {

		this.element = element;
		const tooltip = this.dom = document.createElement( 'div' );

		element.addEventListener( 'mouseover', () => this.update() );
		element.addEventListener( 'focus', () => this.update() );
		window.addEventListener( 'scroll', () => this.update(), true );

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

	update( e ) {

		this.dom.style.top = this.element.getBoundingClientRect().top + "px";
		this.dom.style.left = this.element.getBoundingClientRect().left + "px";

	}

}

export { Tooltip };
