"use strict";

const expect = require("./expect");

const string = require("../src/string.js");

describe("string", () => {
	describe("convert", () => {
		it("should behave like Symbol.prototype.toString for symbols", () => {
			expect(string.convert(Symbol("test"))).to.equal("Symbol(test)");
			expect(string.convert(Symbol.for("foo"))).to.equal("Symbol(foo)");
			expect(string.convert(Symbol())).to.equal("Symbol()");
		});

		it("should behave like Object.prototype.toString for objects with prototype null", () => {
			expect(string.convert(Object.create(null))).to.equal("[object Object]");
		});

		it("should behave like implicit string coercion for all other values", () => {
			expect(string.convert("test")).to.equal("test");
			expect(string.convert(1)).to.equal(String(1));
			expect(string.convert(true)).to.equal(String(true));
			expect(string.convert(null)).to.equal(String(null));
			expect(string.convert(undefined)).to.equal(String(undefined));
			expect(string.convert(() => 1)).to.equal(String(() => 1));
			expect(string.convert({})).to.equal(String({}));
			expect(string.convert({
				toString: () => "a"
			})).to.equal("a");
			expect(string.convert({
				valueOf: () => 2
			})).to.equal(String(2));
		});
	});

	describe("tag", () => {
		it("should behave like String.raw but apply string.convert on each substitution first", () => {
			expect(string.tag`abc`).to.equal(`abc`); // eslint-disable-line quotes
			expect(string.tag`${2}abc${1}`).to.equal(`${string.convert(2)}abc${string.convert(1)}`);
			expect(string.tag`abc${{}}`).to.equal(`abc${string.convert({})}`);
			expect(string.tag`x${Object.create(null)}x`).to.equal(`x${string.convert(Object.create(null))}x`);
			expect(string.tag`x${Symbol()}x`).to.equal(`x${string.convert(Symbol())}x`);
		});
	});
});
