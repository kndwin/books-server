import { ApolloServer, gql } from 'apollo-server'
import { Book, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const typeDefs = gql`
	type Book {
		id: String
		title: String
		author: String
		description: String
		publisher: String
		publishedDate: String
		pageCount: Int
		imageLinks: String
	}

	type Query {
		books: [Book]
	}

	type Mutation {
		addBook(
			title: String, 
			author: String, 
			description: String, 
			publisher: String
			publishedDate: String
			pageCount: Int
			imageLink: String
		): Book

		deleteBook(id: String): Book

		editBook(
			id: String, 
			title: String, 
			author: String, 
			description: String, 
			publisher: String
			publishedDate: String
			pageCount: Int
			imageLink: String
		): Book
	}
`

const resolvers = {
	Query: {
		books: () => { 
			return prisma.book.findMany()
		}
	},

	Mutation: {
		addBook: (_: ParentNode, args: { data: Book }) => {
			return prisma.book.create({ data: args.data })
		},
		deleteBook: (_: ParentNode, { id }: { id: string}) => {
			return prisma.book.delete({ where: { id }})
		},
		editBook: (_: ParentNode, args: { data: Book }) => {
			return prisma.book.update({ where: { id: args.data.id }, data: args.data})
		}
	}
}

const server = new ApolloServer({ 
	typeDefs, 
	resolvers, 
	cors: {
		origin: "*" // TODO: restrict to only from Nextjs server
	}
})

const startServer = async () => {
	const { url } = await server.listen({ port: process.env.PORT || 4000 })
	console.log(`🚀 Server ready at ${url}`)
}
startServer()
