import {
   GraphQLObjectType as ObjectType,
   GraphQLString as StringType,
   GraphQLNonNull as NonNull,
} from 'graphql';

const TextType = new ObjectType({
   name: 'TextType',
   fields: {
      src: { type: new NonNull(StringType) },
      text: { type: StringType },
   },
});

export default TextType;
