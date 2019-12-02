import { prisma } from './../../generated/prisma-client/index';
import * as bcrypt from 'bcrypt';
import { User } from '../../generated/prisma-client';

export const resolvers = {
	User: {
		todoList(parent: any, args: any, context: any) {
			return prisma.user({ id: parent.id }).todoList();
		},
	},
	Query: {
		users: (parent: any, args: any, context: any) => {
			return context.prisma.users();
		},
		user: async (parent: any, { where }: any, context: any) => {
			const { id } = where;
			return context.prisma.user({ id });
		},
	},
	Mutation: {
		createUser: async (parent: any, { data }: any, context: any) => {
			const { name, username, password } = data;
			const hash = await bcrypt.hash(password, 10);
			const user = await context.prisma.createUser({
				password: hash,
				name,
				username,
			});
			return user;
		},
		login: async (parent: any, { username, password }: any, context: any) => {
			const user = await context.prisma.user({ username });
			if (!user) {
				throw new Error(`No such user found for username: ${username}`);
			}
			const valid = await bcrypt.compareSync(password, user.password);
			if (!valid) {
				throw new Error('Invalid Password');
			}
			return user;
		},
		createTodoListItemByUser: async (parent: any, { data, userId }: any, context: any) => {
			const user = await context.prisma.user({ id: userId });
			if (!user) {
				throw new Error(`No such user found for id: ${userId}`);
			}
			const result = await context.prisma.updateUser({
				data: { todoList: { create: [{ ...data }] } },
				where: { id: userId },
			});
			return result;
		},
	},
};
