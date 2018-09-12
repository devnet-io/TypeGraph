import Entity from "../src/decorators/entity/Entity";
import Field from "../src/decorators/field/Field";
import { generateMutation, MutationType } from '../src/query/query';

@Entity({ create: "createCompany", update: "updateCompany", delete: "deleteCompany" })
class TestClass {

	@Field()
	public id: number;

	@Field()
	public name: string;

}

describe("Mutation Generator", () => {
	it("mutate create", () => {
		const fields = {
			entityId: {},
			operationPerformed: {}
		};

		const mutationCreate = generateMutation(TestClass, MutationType.CREATE, fields);
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation{createCompany{entityId,operationPerformed}}");
	});

	it("mutate create params", () => {
		const fields = {
			entityId: {},
			operationPerformed: {}
		};

		const params = {payload: {id: 3, name: "test"}};

		const mutationCreate = generateMutation(TestClass, MutationType.CREATE, fields, params);
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation{createCompany(payload:{id:3,name:\"test\"}){entityId,operationPerformed}}");
	});

	it("mutate create params alias", () => {
		const fields = {
			entityId: {},
			operationPerformed: {}
		};

		const params = {payload: {id: 3, name: "test"}};

		// alias "data"
		const mutationCreate = generateMutation(TestClass, MutationType.CREATE, fields, params, "data");
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation{data:createCompany(payload:{id:3,name:\"test\"}){entityId,operationPerformed}}");
	});

	it("mutate update", () => {
		const fields = {
			entityId: {},
			operationPerformed: {}
		};

		const mutationCreate = generateMutation(TestClass, MutationType.UPDATE, fields);
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation{updateCompany{entityId,operationPerformed}}");
	});

	it("mutate update params", () => {
		const fields = {
			entityId: {},
			operationPerformed: {}
		};

		const params = {payload: {id: 3, name: "test"}};

		const mutationCreate = generateMutation(TestClass, MutationType.UPDATE, fields, params);
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation{updateCompany(payload:{id:3,name:\"test\"}){entityId,operationPerformed}}");
	});

	it("mutate update params alias", () => {
		const fields = {
			entityId: {},
			operationPerformed: {}
		};

		const params = {payload: {id: 3, name: "test"}};

		// alias "data"
		const mutationCreate = generateMutation(TestClass, MutationType.UPDATE, fields, params, "data");
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation{data:updateCompany(payload:{id:3,name:\"test\"}){entityId,operationPerformed}}");
	});

	it("mutate delete", () => {
		const fields = {
			entityId: {},
			operationPerformed: {}
		};

		const mutationCreate = generateMutation(TestClass, MutationType.DELETE, fields);
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation{deleteCompany{entityId,operationPerformed}}");
	});

	it("mutate delete params", () => {
		const fields = {
			entityId: {},
			operationPerformed: {}
		};

		const params = {payload: {id: 3, name: "test"}};

		const mutationCreate = generateMutation(TestClass, MutationType.DELETE, fields, params);
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation{deleteCompany(payload:{id:3,name:\"test\"}){entityId,operationPerformed}}");
	});

	it("mutate delete params alias", () => {
		const fields = {
			entityId: {},
			operationPerformed: {}
		};

		const params = {payload: {id: 3, name: "test"}};

		// alias "data"
		const mutationCreate = generateMutation(TestClass, MutationType.DELETE, fields, params, "data");
		console.log(mutationCreate);
		expect(mutationCreate).toEqual("mutation{data:deleteCompany(payload:{id:3,name:\"test\"}){entityId,operationPerformed}}");
	});

	it("invalid class throws error", () => {
		expect(() => {
			generateMutation(undefined, MutationType.CREATE, {});
		}).toThrow();
	});

	it("invalid query type throws error", () => {
		expect(() => {
			generateMutation(TestClass, undefined, {});
		}).toThrow();
	});
});
