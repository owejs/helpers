"use strict";

const string = module.exports = {
	convert(val) {
		if(typeof val === "symbol")
			return val.toString();

		if(val && typeof val === "object" && typeof val.toString !== "function")
			return Object.prototype.toString.call(val);

		return "" + val; // eslint-disable-line prefer-template
	},

	tag: (strings, ...args) => String.raw(strings, ...args.map(string.convert))
};
