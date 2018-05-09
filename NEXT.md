A library for combining TypeScript classes and GraphQL queries.

# TypeGraph
TypeGraph eliminates the need to write both GraphQL queries and TypeScript interfaces to describe query results by:

* Generating GraphQL queries from decorated classes
* Connecting the results of queries to React components

Resutls always conform to a class. If you are not using React the generated queries are available as plain strings.


## Preview

```ts
import { Entity, IQueryOne, QueryOne } from 'typegraph';
import * as React from "react";


// Describe the data you want

@Entity({one: "company", many: "companies"})
class Company {

    @Field()
    name: string;

    @Field()
    industry: string;
}

// Fetch and render it!

@QueryOne(Company, {id: 343})
class CompanyPanel extends React.Component<IQueryOne<Company>, any> {

    public render() {
        const { data } = this.props;

        return (
            <div>
                Name: {data.name}
                Industry: {data.industry}
            </div>
        )
    }
}
```
### Whats happening here?

* A GraphQL query is being generated from the decorators on the Company class:
 ```
query {
    company(id: 343) {
        name
        industry
    }
}
 ```

* The query is being set a HOC responsible for fetching the data and passing it as props to it's children. The component used here is configurable or a custom implementation can be used. Example with react-apollo below.

* The component receives the data as props. 

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

    @field()
    id: number;

    @field()
    name: string;

    @field()
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
```

## Providing data to a React component

### Setup how queries should be executed
This function is passed the decorated component, the generated query, and the components props. It should return the component with with data fetched from the graphql api added to its props, either by wrapping it a provider, or by copying the props object and including. The example here is using [react-apollo](https://github.com/apollographql/react-apollo).

```ts
import { QueryProvider } from  'typegraph'
import { ComponentClass } from "react";
import { gql, graphql } from "react-apollo";

// Use react-apollo to execute queries and pass results to the query as props
const connectQuery = (Component: React.Component, query: string, props: object) => {

    const connectedComponent = graphql(gql`query { ${query} }`)(Component);
    
    return React.createElement(connectedComponent, props);
}

QueryProvider.setup({
    debug: true, // Show generated queries in console when in NODE_ENV is dev
    connect: connectQuery
})

```

### Connecting the component

Decorate the component to receive the data fetched form the graphql api as props

```js
import { IQueryMany, QueryMany } from 'typegraph';

@QueryMany(Company)
class CompanyPanel extends React.Component<IQueryMany<Company>, any> {

    public render() {
        const { data } = this.props;

        if(!data.loading && data.entities) {
            data.entities.map(c => (
                <div className="company">{c.name}</div>
            ));

            return (
                <div>
                    {companies}
                </div>
            );

        } else {
            return (<div>Loading...</div>);
        }
    }
}
```

## Upcoming improvements
- Better generics for query decorators
- Multiple queries per component