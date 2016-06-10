"use strict";

const expect = require("expect.js");

const string = require("../src/string.js");

describe("string", () => {
	describe("convert", () => {
		it("should behave like Symbol.prototype.toString for symbols", () => {
			expect(string.convert(Symbol("test"))).to.be("Symbol(test)");
			expect(string.convert(Symbol.for("foo"))).to.be("Symbol(foo)");
			expect(string.convert(Symbol())).to.be("Symbol()");
		});

		it("should behave like Object.prototype.toString for objects with prototype null", () => {
			expect(string.convert(Object.create(null))).to.be("[object Object]");
		});

		it("should behave like implicit string coercion for all other values", () => {
			expect(string.convert("test")).to.be("test");
			expect(string.convert(1)).to.be(String(1));
			expect(string.convert(true)).to.be(String(true));
			expect(string.convert(null)).to.be(String(null));
			expect(string.convert(undefined)).to.be(String(undefined));
			expect(string.convert(() => 1)).to.be(String(() => 1));
			expect(string.convert({})).to.be(String({}));
			expect(string.convert({
				toString: () => "a"
			})).to.be("a");
			expect(string.convert({
				valueOf: () => 2
			})).to.be(String(2));
		});
	});

	describe("tag", () => {
		it("should behave like String.raw but apply string.convert on each substitution first", () => {
			expect(string.tag`abc`).to.be("abc");
			expect(string.tag`abc${1}`).to.be(`abc${1}`);
			expect(string.tag`abc${{}}`).to.be(`abc${{}}`);
			expect(string.tag`x${Object.create(null)}x`).to.be("x[object Object]x");
			expect(string.tag`x${Symbol()}x`).to.be("xSymbol()x");
		});
	});
});
