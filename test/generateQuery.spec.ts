// tslint:disable: no-console max-classes-per-file

import Entity from "../src/decorators/entity/Entity";
import Field from "../src/decorators/field/Field";
import { generateQuery, QueryType } from '../src/query/query';

@Entity({ one: "industry", many: "industries" })
class Industry {

	@Field()
	public id: number;

	@Field()
	public fieldOne: string;
}

@Entity({ one: "company", many: "companies" })
class TestClass {

	@Field()
	public id: number;

	@Field()
	public name: string;

	@Field({entity: Industry})
	public industry: Industry;
}

describe("Query Generator", () => {
	it("query one", () => {

		const queryOne = generateQuery(TestClass, QueryType.ONE);
		console.log(queryOne);
		expect(queryOne).toEqual("{company{id,name,industry{id,fieldOne}}}");

	});

	it("query many", () => {

		const queryMany = generateQuery(TestClass, QueryType.MANY);
		console.log(queryMany);
		expect(queryMany).toEqual("{companies{id,name,industry{id,fieldOne}}}");

	});

	it("query one params", () => {

		const queryOneParams = generateQuery(TestClass, QueryType.ONE, {foo: "bar"});
		console.log(queryOneParams);
		expect(queryOneParams).toEqual("{company(foo:\"bar\"){id,name,industry{id,fieldOne}}}");

	});

	it("query many params", () => {

		const queryManyParams = generateQuery(TestClass, QueryType.MANY, {foo: "bar", count: 3, enabled: true});
		console.log(queryManyParams);
		expect(queryManyParams).toEqual("{companies(foo:\"bar\",count:3,enabled:true){id,name,industry{id,fieldOne}}}");

	});

	it("invalid class throws error", () => {
		expect(() => {
			generateQuery(undefined, QueryType.MANY);
		}).toThrow();
	});

	it("invalid query type throws error", () => {
		expect(() => {
			generateQuery(TestClass, undefined);
		}).toThrow();
	});

});
