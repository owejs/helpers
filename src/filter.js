"use strict";

/**
 * Applies a given filter function and always returns a Promise for the resulting match/mismatch boolean.
 * @module helpers
 * @param {boolean|function} filter The filter.
 * @param {Object} context The context to be used for the filter function.
 * @param {string} args The arguments for the filter function.
 * @return {Promise} A Promise that resolves to either true or false. It rejects if filter has a wrong type or if the filter function threw or rejected.
 */
module.exports = function filterTool(filter, context, ...args) {
	if(typeof filter === "boolean")
		return Promise.resolve(filter);

	if(typeof filter !== "function")
		return Promise.reject(new TypeError("Filters have to be booleans or functions."));

	try {
		return Promise.resolve(filter.apply(context, args)).then(result => !!result);
	}
	catch(err) {
		return Promise.reject(err);
	}
};
