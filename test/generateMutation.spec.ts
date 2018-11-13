// tslint:disable: no-console max-classes-per-file

import Entity from "../src/decorators/entity/Entity";
import Field from "../src/decorators/field/Field";
import { generateMutation, MutationType } from '../src/query/query';
import { addEnum, addVariable } from "../src/util/Variables";

@Entity({ create: "createCompany", update: "updateCompany", delete: "deleteCompany" })
class ActionResult {

	@Field()
	public entityId: string;

	@Field()
	public operationPerformed: MutationType;

}

@Entity({ create: "createCompany", update: "updateCompany", delete: "deleteCompany", params: (paramData: any) => ({name: paramData.name}) })
class ActionResultWithCreateParams {

	@Field()
	public entityId: string;

	@Field()
	public operationPerformed: MutationType;

}

@Entity({ create: "createCompany", update: "updateCompany", delete: "deleteCompany", params: { someVariable: addVariable("myVar", "String", false, "asdf") } })
class ActionResultWithVars {

	@Field()
	public entityId: string;

	@Field({
		params: {
			secondVariable: addVariable("secondVariable", "Boolean", true),
			enumParam: addEnum("MY_ENUM")
		}
	})
	public operationPerformed: MutationType;

}


describe("Mutation Generator", () => {
	it("mutate create", () => {

		const mutationCreate = generateMutation(ActionResult, MutationType.CREATE);
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation { createCompany { entityId operationPerformed } }");
	});

	it("mutate create params", () => {

		const params = {name: "test"};

	 const mutationCreate = generateMutation(ActionResultWithCreateParams, MutationType.CREATE, params);
	 console.log(mutationCreate);
	 expect(mutationCreate).toEqual("mutation { createCompany (name: \"test\") { entityId operationPerformed } }");
	});

 it("mutate create params alias", () => {

		const params = {name: "test"};

		const mutationCreate = generateMutation(ActionResultWithCreateParams, MutationType.CREATE, params, "data");
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation { data: createCompany (name: \"test\") { entityId operationPerformed } }");
	});

 it("mutate update params", () => {
		const params = {name: "test"};

		const mutationCreate = generateMutation(ActionResultWithCreateParams, MutationType.UPDATE, params);
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation { updateCompany (name: \"test\") { entityId operationPerformed } }");
	});

 it("mutate update params alias", () => {
		const params = {name: "test"};

		const mutationCreate = generateMutation(ActionResultWithCreateParams, MutationType.UPDATE, params, "data");
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation { data: updateCompany (name: \"test\") { entityId operationPerformed } }");
	});

 it("mutate delete", () => {
		const params = {name: "test"};

		const mutationCreate = generateMutation(ActionResultWithCreateParams, MutationType.DELETE, params);
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation { deleteCompany (name: \"test\") { entityId operationPerformed } }");
	});

 it("mutate with variables", () => {
		const mutationCreate = generateMutation(ActionResultWithVars, MutationType.CREATE);

		console.log(mutationCreate);

		expect(mutationCreate).toEqual("mutation ($myVar: String = \"asdf\", $secondVariable: Boolean!) { createCompany (someVariable: $myVar) { entityId operationPerformed (secondVariable: $secondVariable, enumParam: MY_ENUM) } }");
	});

 it("invalid class throws error", () => {
		expect(() => {
			generateMutation(undefined, MutationType.CREATE, {});
		}).toThrow();
	});

 it("invalid query type throws error", () => {
		expect(() => {
			generateMutation(ActionResult, undefined, {});
		}).toThrow();
	});
});
