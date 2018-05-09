A library for combining TypeScript classes and GraphQL queries.

!> Note: this library is under active development, breaking changes may occur

# TypeGraph
TypeGraph eliminates the need to write both GraphQL queries and TypeScript interfaces to describe query results by generating GraphQL queries from decorated classes.

[image]

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


```js
    import { generateQuery } from 'typegraph';

    const queryOne: string = generateQuery(Company, QueryType.ONE);

    /* company {
        id
        name
        industry
    } */

    const queryMany: string = generateQuery(Company, QueryType.MANY);

    /* companies {
        id
        name
        industry
    } */

    const queryOneWithProps: string = generateQuery(Company, QueryType.ONE, {name: "doge", industry: "dogs"});

    /* company(name: "doge", industry: "dogs") {
        id
        name
        industry
    } */
```

## Upcoming improvements
- Support for mutations
- Support for params on sub fields
- Support for GraphQL Variables
- Connect components to data! See [NEXT.md](NEXT.md)