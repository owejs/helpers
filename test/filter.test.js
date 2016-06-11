"use strict";

const expect = require("chai").expect;

const filter = require("../src/filter.js");

describe("filter", () => {
	it("should handle booleans", () => {
		return Promise.all([
			expect(filter(true, null, null)).to.eventually.equal(true),
			expect(filter(true)).to.eventually.equal(true),
			expect(filter(true, null, "test")).to.eventually.equal(true),
			expect(filter(true, null, {})).to.eventually.equal(true),
			expect(filter(true, null, 123)).to.eventually.equal(true),
			expect(filter(true, null, Symbol("test"))).to.eventually.equal(true),

			expect(filter(false, null, null)).to.eventually.equal(false),
			expect(filter(false)).to.eventually.equal(false),
			expect(filter(false, null, "test")).to.eventually.equal(false),
			expect(filter(false, null, {})).to.eventually.equal(false),
			expect(filter(false, null, 123)).to.eventually.equal(false),
			expect(filter(false, null, Symbol("test"))).to.eventually.equal(false)
		]);
	});

	it("should handle functions", () => {
		const ctx = {};
		const data = [1, "test", ctx];
		const e = new Error("test");

		return Promise.all([
			expect(filter(() => Promise.resolve(true))).to.eventually.equal(true),
			expect(filter(() => Promise.resolve(false))).to.eventually.equal(false),
			expect(filter(() => Promise.resolve("test"))).to.eventually.equal(true),
			expect(filter(() => Promise.resolve(""))).to.eventually.equal(false),
			expect(filter(function(...args) {
				expect(this).to.equal(undefined);
				expect(args).to.deep.equal([]);

				return true;
			})).to.eventually.equal(true),
			expect(filter(function(...args) {
				expect(this).to.equal(ctx);
				expect(args).to.deep.equal(data);

				return false;
			}, ctx, ...data)).to.eventually.equal(false),
			expect(filter(function(...args) {
				expect(this).to.equal(null);
				expect(args).to.deep.equal(["test"]);

				throw e;
			}, null, "test")).to.be.rejectedWith(e),
			expect(filter(() => Promise.reject(e))).to.be.rejectedWith(e)
		]);
	});

	it("should reject for invalid filter types", () => {
		const e = [TypeError, "Filters have to be booleans or functions."];

		return Promise.all([
			expect(filter()).to.be.rejectedWith(...e),
			expect(filter(null)).to.be.rejectedWith(...e),
			expect(filter(new Boolean(false))).to.be.rejectedWith(...e), // eslint-disable-line no-new-wrappers
			expect(filter("true")).to.be.rejectedWith(...e),
			expect(filter(1)).to.be.rejectedWith(...e),
			expect(filter(Symbol())).to.be.rejectedWith(...e)
		]);
	});
});
