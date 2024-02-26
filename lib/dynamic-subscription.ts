import { Injectable } from '@angular/core';

import type { TypedDocumentNode } from '@apollo/client/core';

import { SelectionOptions, select } from 'apollo-dynamic';
import { Apollo } from 'apollo-angular';
import {
  EmptyObject,
  ExtraSubscriptionOptions,
  SubscriptionOptionsAlone,
  SubscriptionResult
} from 'apollo-angular/types';
import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';

@Injectable()
export class DynamicSubscription<T = any, V = EmptyObject> extends Function {
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

  public subscribe(
    variables?: V,
    options?: SubscriptionOptionsAlone<V, T>,
    extra?: ExtraSubscriptionOptions
  ): Observable<SubscriptionResult<T>> {
    return this.apollo.use(this.client).subscribe<T, V>(
      {
        ...options,
        variables,
        query: select(this.document, this.selectionOptions)
      },
      extra
    );
  }
}
