!> **Note: this library is under active development, breaking changes may occur**

# TypeGraph
TypeGraph generates GraphQL queries from decorated TypeScript classes, eliminating the need to write both queries to get data and interfaces to describe the results.

## Getting Started

### Install

```
npm install typegraph --save
```

### Decorate your classes / entities
Using a class instead of a typescript interface allows access during runtime

```ts
import { Entity } from 'typegraph';

@Entity({one: "company", many: "companies"})
class Company {

    @Field()
    id: number;

    @Field()
    name: string;

    @Field()
    industry: string;
}
```
### Getting the query
You can get the query as a string using the generateQuery function.

#### One
```ts
import { generateQuery, QueryType } from 'typegraph';

const queryOne: string = generateQuery(Company, QueryType.ONE);
```
Produces:
```
{ 
    company {
        id
        name
        industry
    }
}
```
#### Many
```ts
import { generateQuery, QueryType } from 'typegraph';

const queryMany: string = generateQuery(Company, QueryType.MANY);
```
Produces:
```
{
    companies {
        id
        name
        industry
    }
}
```
#### With Params
```ts
import { generateQuery, QueryType } from 'typegraph';

const queryOneWithProps: string = generateQuery(Company, QueryType.ONE, {name: "doge", industry: "dogs"});
```
Produces:
```
{
    company(name: "doge", industry: "dogs") {
        id
        name
        industry
    }
}
```

## Upcoming improvements
- Support for mutations
- Support for params on sub fields
- Support for GraphQL Variables
- Connect components to data! See [NEXT.md](NEXT.md)