# Apollo Dynamic Angular [![npm version](https://badge.fury.io/js/apollo-dynamic-angular.svg)](https://badge.fury.io/js/apollo-dynamic-angular)

Apollo Dynamic allows to create dynamic selection sets on queries, mutations and subscriptions when using [`@apollo/client`](https://github.com/apollographql/apollo-client) for consult GraphQL resolvers. It works by decorating entity classes with `@SelectionType` and `@SelectionField` which allows to fabric dynamics selections set with a similar syntax as TypeORM repositories (relations).

This library is a wrapper of [`apollo-dynamic`](https://github.com/giuliano-marinelli/apollo-dynamic) for Angular, it offer the same `@Injectable` classes as [`apollo-angular`](https://github.com/kamilkisiela/apollo-angular): _Query_, _Mutation_ and _Subscription_. But with support for dynamic selection set based on Apollo Dynamic library. Given the new classes: _DynamicQuery_, _DynamicMutation_ and _DynamicSubscription_.

## Installation

```bash
$ npm install apollo-dynamic-angular

# dependencies
$ npm install apollo-angular @apollo/client graphql
```

## Usage

### Decorators

With this library you can use the `@SelectionType` and `@SelectionField` from [`apollo-dynamic`](https://github.com/giuliano-marinelli/apollo-dynamic):

```typescript
import { SelectionType, SelectionField } from 'apollo-dynamic'

@SelectionType('Person')
export class Person {
    @SelectionField()
    id?: string;

    @SelectionField()
    firstname?: string;

    @SelectionField()
    lastname?: string;

    @SelectionField({ include: 'isSuperAgent' })
    secret?: string;

    @SelectionField(() => Profile)
    profile: Profile;

    @SelectionField(() => Article)
    articles: Article[];
}

@SelectionType('Profile')
export class Profile {
    @SelectionField()
    avatar: string;

    @SelectionField()
    nickname: string;
}

@SelectionType('Article',{
    default: { relations: { artType: true } }
})
export class Article {
    @SelectionField({ skip: (cond) => cond.noIDsPlease })
    id: string,

    @SelectionField()
    name: string;

    @SelectionField(() => Person)
    person: Person;

    @SelectionField(() => ArticleType)
    artType: ArticleType;
}

@SelectionType('ArticleType')
export class ArticleType {
    @SelectionField()
    category: string;

    @SelectionField()
    section: string;
}
```

### DynamicQuery, DynamicMutation and DynamicSubscription

---

But you can use this with [`apollo-angular`](https://github.com/kamilkisiela/apollo-angular) mechanisms. For example:

```typescript
const GET_PERSONS = gql`
  query GetPersons {
    persons {
      Person
    }
  }
`;
```

```typescript
this.apollo
  .query({
    query: select(GET_PERSONS, { relations: { profile: true } })
  })
  .subscribe();
```

Or better, with the new approach:

```typescript
@Injectable({ providedIn: 'root' })
export class FindPersons extends DynamicQuery<{ persons: Person[] }> {
  override document = gql`
    query Persons {
      persons {
        Person
      }
    }
  `;
}
```

```typescript
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
// import a service
import { FindPersons, Person } from './persons.entity';

@Component({
  // ...
})
export class ListPersons implements OnInit {
  persons: Observable<Person[]>;

  // inject it
  constructor(private findPersons: FindPersons) {}

  ngOnInit() {
    // use it!
    this.persons = this.findPersons({ relations: { profile: true } })
      .fetch()
      .valueChanges.pipe(map(({ data }) => data.persons));
  }
}
```

Same apply for Mutations and Subscriptions.

---

### Please consider reading the [`apollo-dynamic`](https://github.com/giuliano-marinelli/apollo-dynamic#readme) usage guide for more information.

## Stay in touch

- Author - [Giuliano Marinelli](https://www.linkedin.com/in/giuliano-marinelli/)
- Website - [https://github.com/giuliano-marinelli](https://github.com/giuliano-marinelli)

## License

This package is [MIT licensed](LICENSE).
