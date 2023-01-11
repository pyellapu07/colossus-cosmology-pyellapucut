const Tabs = {
	'Basic': {
		input: {
			'redshift (z)': [ 'float', 0 ],
		},
		output: {

		}
	},
	'Time': {
		input: {
			'function': [ 'radio', [ 'redshift (z)', 'time (t)', 'scale factor (a)' ]],
		},
		output: {

		}
	},
	'Distance': {
		input: {

		},
		output: {

		}
	},
	'Content': {
		input: {
			'function': [ 'radio', [ 'redshift (z)', 'time (t)', 'scale factor (a)' ]],
			'plot layout': [ 'radio', [ 'combined', 'seperate' ]]
		},
		output: {

		}
	},
	'Power Spectrum': {
		input: {
			'model': [ 'radio', [ 'eisentein_98', 'eisenstein98_zb', 'sugiyama95', 'camb' ]],
			'wavenumber (k)': [ 'range' ]
		},
		output: {

		}
	},
	'Correlation': {
		input: {
			'model': [ 'radio', [ 'eisentein_98', 'eisenstein98_zb', 'sugiyama95', 'camb' ]],
			'radius (R)': [ 'range' ]
		},
		output: {

		}
	},
	'Peak Height': {
		input: {
			'model': [ 'radio', [ 'eisentein_98', 'eisenstein98_zb', 'sugiyama95', 'camb' ]],
			'halo mass (M)': [ 'range' ],
		},
		output: {

		}
	},
};

export { Tabs };
