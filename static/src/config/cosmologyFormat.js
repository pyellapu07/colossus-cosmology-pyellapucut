export default {
	"flat": {
		"text": "flat",
		"def": "If flat, there is no curvature, Ω<sub>k</sub> = 0, and the dark energy content of the universe is computed as Ω<sub>de</sub> = 1 − Ω<sub>m</sub> − Ω<sub>γ</sub> − Ω<sub>ν</sub> where Ω<sub>m</sub> is the density of matter (dark matter and baryons) in units of the critical density, Ω<sub>γ</sub> is the density of photons, and Ω<sub>ν</sub> the density of neutrinos.",
		"type": "bool",
		"dependencies": { "Ode0": false }
	},
	"H0": {
		"text": "H<sub>0</sub>",
		"def": "The Hubble constant in km/s/Mpc.",
		"type": "float",
		"min": 0,
		"step": 1
	},
	"Om0": {
		"text": "Ω<sub>m</sub>",
		"def": "Ω<sub>m</sub>, the matter density in units of the critical density at z = 0 (includes all non-relativistic matter, i.e., dark matter and baryons but not neutrinos).",
		"type": "float",
		"min": 0,
		"max": 1,
		"step": 0.1
	},
	"Ob0": {
		"text": "Ω<sub>b</sub>",
		"def": "Ω<sub>b</sub>, the baryon density in units of the critical density at z = 0.",
		"type": "float",
		"min": 0,
		"max": 1,
		"step": 0.1
	},
	"Ode0": {
		"text": "Ω<sub>de</sub>",
		"def": "Ω<sub>de</sub>, the dark energy density in units of the critical density at z = 0.",
		"type": "float",
		"min": 0,
		"max": 1,
		"step": 0.1
	},
	"sigma8": {
		"text": "σ<sub>8</sub>",
		"def": "The normalization of the power spectrum, i.e. the variance when the field is filtered with a top hat filter of radius 8 Mpc/h.",
		"type": "float",
		"min": 0,
		"step": 0.1
	},
	"ns": {
		"text": "n<sub>s</sub>",
		"def": "The tilt of the primordial power spectrum.",
		"type": "float",
		"min": 0,
		"step": 0.1
	},
	"relspecies": {
		"text": "relspecies",
		"def": "If relspecies == False, all relativistic contributions to the energy density of the universe (such as photons and neutrinos) are ignored.",
		"type": "bool"
	}
};
