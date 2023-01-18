class Data {

	constructor() {

		this.models = [];
		this.tab = undefined;

	}

	needsUpdate() {

		console.log( 'Data updated!', this );

	}

}

export { Data };
