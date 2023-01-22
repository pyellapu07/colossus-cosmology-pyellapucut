class Data {

	constructor( main ) {

		this.main = main;
		this.models = [];
		this.tab = undefined;

	}

	needsUpdate() {

		console.log( 'Data updated!', this );

		if ( this.main.output != undefined )
			this.main.output.runModel();

	}

	toJSON() {

		return {
			models: this.models,
			tab: this.tab
		};

	}

}

export { Data };
