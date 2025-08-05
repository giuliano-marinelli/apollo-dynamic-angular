import { Injectable } from '@angular/core';

import type { TypedDocumentNode } from '@apollo/client/core';

import { SelectionOptions, select } from 'apollo-dynamic';
import { Apollo } from 'apollo-angular';
import type { MutationOptionsAlone, MutationResult } from 'apollo-angular';
import type { DocumentNode } from 'graphql';
import type { Observable } from 'rxjs';

@Injectable()
export class DynamicMutation<T = {}, V = { [key: string]: any }> extends Function {
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

  public mutate(variables?: V, options?: MutationOptionsAlone<T, V>): Observable<MutationResult<T>> {
    return this.apollo.use(this.client).mutate<T, V>({
      ...options,
      variables,
      mutation: select(this.document, this.selectionOptions)
    });
  }
}
