import {
   GraphQLList as List,
   GraphQLInt as IntType,
   GraphQLObjectType as ObjectType,
   GraphQLString as StringType,
   GraphQLNonNull as NonNull,
} from 'graphql';

import TagType from '../../../../data/types/TagType';

const BitType = new ObjectType({
   name: 'BitType',
   fields: {
      id: { type: new NonNull(StringType) },
      caption: { type: StringType },
      tags: { type: new List(TagType) },
   },
});

export default BitType;
