// tslint:disable: no-console max-classes-per-file

import Entity from "../src/decorators/entity/Entity";
import Field from "../src/decorators/field/Field";
import { generateQuery, QueryType } from '../src/query/query';
import { addVariable } from "../src/util/Variables";

@Entity({ one: "industry", many: "industries" })
class Industry {

	@Field()
	public id: number;

	@Field()
	public fieldOne: string;
}

@Entity({ one: "company", many: "companies", params: (paramData) => paramData })
class TestClass {

	@Field()
	public id: number;

	@Field()
	public name: string;

	@Field({entity: Industry})
	public industry: Industry;
}

// class with directive and variable
@Entity({ one: "doge" })
class Doge {

	@Field()
	public id: number;

	@Field({
		directive: "include",
		entity: Industry,
		params: {
			if: addVariable("includeIndustry", "Boolean", false, false)
		}
	})
	public industry: Industry;

}


@Entity({one: "manyAliases"})
class MultipleAliases {

	@Field({aliasFor: "id"})
	public myId: string;

	@Field({aliasFor: "name"})
	public myName: string;

	@Field({aliasFor: "industry", entity: Industry, params: {id: 123}})
	public myIndustry: Industry;

}


@Entity({
	one: "employee",
	many: "employees",
	params: (paramData: any) => ({id: paramData.id})
})
class Employee {

	@Field()
	public id: string;

	@Field({ params: { one: addVariable("one", "String", true) } })
	public fieldOne: string;

	@Field({ params: { two: addVariable("two", "Boolean", false, false) } })
	public fieldTwo: string;

}

@Entity({one: "badParamsClass"})
class BadParamsClass {

	@Field({params: () => 1234})
	public name: string;

}

@Entity({
	one: "employee",
	many: "employees",
	params: (paramData: any) => ({id: paramData.id})
})
class Employee2 {

	@Field()
	public id: string;

	@Field({ params: { one: addVariable("one", "String", true) } })
	public fieldOne: string;

	@Field({ params: { one: addVariable("one", "Boolean", false, false) } })
	public fieldTwo: string;

}

@Entity({one: "nestedVariableClass", params: { data: { myParam: addVariable("var1", "String", true) } })
class NestedVariableClass {

	@Field()
	public id: number;
}

@Entity({one: "defaultRootParams", params: true})
class DefaultRootParams {

	@Field()
	public id: number;

}

@Entity({one: "noRootParams", params: false})
class NoRootParams {

	@Field()
	public id: number;

}

@Entity({one: "nullParams", params: { stuff: null }})
class NullParams {
	@Field()
	public id: number;
}

@Entity({one: "excludeName", params: false})
class ExcludeName {

	@Field()
	public id: string;

	@Field({includeIf: (params) => !!params.includeName})
	public name: string;
}


describe("Query Generator", () => {
	it("query one", () => {

		const queryOne = generateQuery(TestClass, QueryType.ONE);
		console.log(queryOne);
		expect(queryOne).toEqual("query { company { id name industry { id fieldOne } } }");

	});

	it("query many", () => {

		const queryMany = generateQuery(TestClass, QueryType.MANY);
		console.log(queryMany);
		expect(queryMany).toEqual("query { companies { id name industry { id fieldOne } } }");

	});

	it("query one params", () => {

		const queryOneParams = generateQuery(TestClass, QueryType.ONE, {foo: "bar"});
		console.log(queryOneParams);
		expect(queryOneParams).toEqual("query { company (foo: \"bar\") { id name industry { id fieldOne } } }");

	});

	it("query one params alias", () => {

		// alias "data"
		const queryOneParams = generateQuery(TestClass, QueryType.ONE, {foo: "bar"}, "data");
		console.log(queryOneParams);
		expect(queryOneParams).toEqual("query { data: company (foo: \"bar\") { id name industry { id fieldOne } } }");

	});

	it("query many params", () => {

		const queryManyParams = generateQuery(TestClass, QueryType.MANY, {foo: "bar", count: 3, enabled: true});
		console.log(queryManyParams);
		expect(queryManyParams).toEqual("query { companies (foo: \"bar\", count: 3, enabled: true) { id name industry { id fieldOne } } }");

	});

	it("query many params alias", () => {

		// alias "data"
		const queryManyParams = generateQuery(TestClass, QueryType.MANY, {foo: "bar", count: 3, enabled: true}, "data");
		console.log(queryManyParams);
		expect(queryManyParams).toEqual("query { data: companies (foo: \"bar\", count: 3, enabled: true) { id name industry { id fieldOne } } }");

	});

 it("query one skips primitive params format", () => {

		const queryBadParams = generateQuery(BadParamsClass, QueryType.ONE);
		console.log(queryBadParams);
		expect(queryBadParams).toEqual("query { badParamsClass { name } }");
	});

 it("query one multiple aliases", () => {

		const queryMultipleAliases = generateQuery(MultipleAliases, QueryType.ONE, {}, "soManyAliases");
	 console.log(queryMultipleAliases);
		expect(queryMultipleAliases).toEqual("query { soManyAliases: manyAliases { myId: id myName: name myIndustry: industry (id: 123) { id fieldOne } } }");

	});

 it("query one property directive", () => {

		const queryOneDirective = generateQuery(Doge, QueryType.ONE);
	 console.log(queryOneDirective);
		expect(queryOneDirective).toEqual("query ($includeIndustry: Boolean = false) { doge { id industry @include (if: $includeIndustry) { id fieldOne } } }");

	});

 it("query many multiple variables", () => {

		const queryMultipleVariables = generateQuery(Employee, QueryType.MANY, { id: 123 });

		expect(queryMultipleVariables).toEqual("query ($one: String!, $two: Boolean = false) { employees (id: 123) { id fieldOne (one: $one) fieldTwo (two: $two) } }");

	});

 it("query one variable nested in params object", () => {

		const queryNestedVariables = generateQuery(NestedVariableClass, QueryType.ONE);
		console.log(queryNestedVariables);
		expect(queryNestedVariables).toEqual("query ($var1: String!) { nestedVariableClass (data: {myParam: $var1}) { id } }");
	});

 it("query one add paramData to root entity by default", () => {

		const query = generateQuery(DefaultRootParams, QueryType.ONE, {params: {sort: "-n"}});
		console.log(query);
		expect(query).toEqual("query { defaultRootParams (params: {sort: \"-n\"}) { id } }");
	});

 it("query one no default params if entity params === false", () => {

		const query = generateQuery(NoRootParams, QueryType.ONE, {params: {one: 1}});
		console.log(query);
		expect(query).toEqual("query { noRootParams { id } }");

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

 it("duplicate variables throw error if type information isn't exactly the same", () => {
		expect(() => generateQuery(Employee2, QueryType.MANY)).toThrow();
	});

 it ("correctly checks typeof null", () => {
		expect(generateQuery(NullParams, QueryType.ONE)).toEqual("query { nullParams (stuff: null) { id } }");
	});

 it("excludes a field if includeIf evaluates to false", () => {

		expect(generateQuery(ExcludeName, QueryType.ONE, {includeName: false})).toEqual("query { excludeName { id } }");
	});

});
