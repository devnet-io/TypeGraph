import Field from "../src/decorators/field/Field";
import Operation from "../src/decorators/operation/Operation";
import generate from "../src/generate/generate";
import { addEnum, addVariable } from "../src/util/Variables";

// tslint:disable:max-classes-per-file

class Employee {
  @Field()
  public id: string;

  @Field()
  public name: string;
}

class Company {
  @Field()
  public id: string;

  @Field()
  public name: string;

  @Field({entity: Employee})
  public employees: Employee[];
}

class Doge {
  @Field()
  public id: string;

  @Field()
  public name: string;
}

@Operation.Query()
class GetMultipleThings {

  @Field({entity: Company, params: {pageSize: addVariable('pageSize', 'Int', false, 10)}})
  public company_many: Company[];

  @Field({entity: Doge})
  public doge_one: Doge;

}

@Operation.Mutation({name: "MyMutation"})
class MutateStuff {

  @Field({
    entity: Doge,
    params: (data: any) => ({
      name: data.name,
      breed: addVariable('breed', 'String', true)
    })
  })
  public doge: Doge;

}

describe("generate", () => {

  it("generates a query string with multiple root fields", () => {

    expect(generate.root(GetMultipleThings, {})).toEqual("query GetMultipleThings ($pageSize: Int = 10) { company_many (pageSize: $pageSize) { id name employees { id name } } doge_one { id name } }");
  });

  it("generates a mutation with a provided name", () => {

    expect(generate.root(MutateStuff, {name: "Shibe"})).toEqual("mutation MyMutation ($breed: String!) { doge (name: \"Shibe\", breed: $breed) { id name } }");
  });

  it("generates a subscription query using the shorthand syntax", () => {

    expect(generate.subscription(Doge, { myDoge: addEnum("Wow") }, {
      name: "entity",
      aliasFor: "doge_one",
      params: (data: any) => ({ myDoge: data.myDoge })
    }, "DogeSubscribe"))
      .toEqual("subscription DogeSubscribe { entity: doge_one (myDoge: Wow) { id name } }");
  });

});
