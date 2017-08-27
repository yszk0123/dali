/**
 * TODO: Find better solution for GraphQL resolver.
 * graphql-sequelize is a very nice tool for prototyping
 * but causes tight coupling of GraphQL and database.
 *
 * This workaround is based on this issue:
 * https://github.com/mickhansen/graphql-sequelize/issues/480#issuecomment-302296300
 */
import {
  resolver as originalResolver,
  IResolverLikeFunction,
} from 'graphql-sequelize';
import { camelCase } from 'lodash';
import { IContext } from '../interfaces';

const OWNER_KEY = 'owner';
const OWNER_ID = 'ownerId';

const resolver: IResolverLikeFunction<IContext> = (
  model: any,
  options: any = {},
) => {
  const hasOwner = model.associations && model.associations[OWNER_KEY];
  const hasMany = options.list || model.associationType === 'HasMany';

  return originalResolver(model, {
    ...options,
    before: (baseFindOptions, args, context, info) => {
      const findOptions = options.before
        ? options.before(baseFindOptions, args, context, info)
        : baseFindOptions;

      if (hasOwner) {
        if (!context.user || !context.user.id) {
          throw new Error('Current user not found');
        }
        findOptions.where = {
          ...findOptions.where,
          [OWNER_ID]: context.user.id,
        };
      }

      if (hasMany && args.orderBy && !findOptions.order) {
        findOptions.order = [
          [camelCase(args.orderBy.field), args.orderBy.direction],
        ];
      }

      return findOptions;
    },
  });
};

export default resolver;
