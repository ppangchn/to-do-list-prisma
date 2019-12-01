import { prisma } from './generated/prisma-client';
import { GraphQLServer } from 'graphql-yoga';
import { importSchema } from 'graphql-import';
import { resolvers } from './src/resolvers';

const server = new GraphQLServer({
	typeDefs: importSchema('./schema.graphql'),
	resolvers,
	context: { prisma },
});
server.start(() => console.log('Server is running on http://localhost:4000'));
