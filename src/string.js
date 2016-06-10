"use strict";

const string = module.exports = {
	convert(val) {
		if(typeof val === "symbol")
			return val.toString();

		if(val && typeof val === "object" && typeof val.toString !== "function")
			return Object.prototype.toString.call(val);

		return "" + val; // eslint-disable-line prefer-template
	},

	tag(strings) {
		const args = [];

		for(let i = 1; i < arguments.length; i++)
			args.push(string.convert(arguments[i]));

		return String.raw(strings, ...args);
	}
};
