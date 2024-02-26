import { Injectable } from '@angular/core';

import type { ApolloQueryResult, OperationVariables, TypedDocumentNode } from '@apollo/client/core';

import { SelectionOptions, select } from 'apollo-dynamic';
import { Apollo } from 'apollo-angular';
import { QueryRef } from 'apollo-angular/query-ref';
import type { EmptyObject, QueryOptionsAlone, WatchQueryOptionsAlone } from 'apollo-angular/types';
import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';

@Injectable()
export class DynamicQuery<T = {}, V extends OperationVariables = EmptyObject> extends Function {
  public document: DocumentNode | TypedDocumentNode<T, V> = null as any;
  public client = 'default';
  public selectionOptions: SelectionOptions = {};

  constructor(protected apollo: Apollo) {
    super();

    return new Proxy(this, {
      apply: (target, _, args) => target._call(args)
    });
  }

  _call(args: any[]) {
    this.selectionOptions = args[0] || {};
    return this;
  }

  public watch(variables?: V, options?: WatchQueryOptionsAlone<V, T>): QueryRef<T, V> {
    return this.apollo.use(this.client).watchQuery<T, V>({
      ...options,
      variables,
      query: select(this.document, this.selectionOptions)
    });
  }

  public fetch(variables?: V, options?: QueryOptionsAlone<V, T>): Observable<ApolloQueryResult<T>> {
    return this.apollo.use(this.client).query<T, V>({
      ...options,
      variables,
      query: select(this.document, this.selectionOptions)
    });
  }
}
