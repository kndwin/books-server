import { ApolloServer, gql } from 'apollo-server'
import { Book, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const typeDefs = gql`
	type Book {
		id: String
		title: String
		author: String
	}

	type Query {
		books: [Book]
	}

	type Mutation {
		addBook(title: String, author: String): Book
		deleteBook(id: String): Book
		editBook(id: String, title: String, author: String): Book

	}
`

const resolvers = {
	Query: {
		books: () => { 
			return prisma.book.findMany()
		}
	},

	Mutation: {
		addBook: (_: ParentNode, { title, author }: { title: string, author: string}) => {
			return prisma.book.create({ data: { title, author} })
		},
		deleteBook: (_: ParentNode, { id }: { id: string}) => {
			return prisma.book.delete({ where: { id }})
		},
		editBook: (_: ParentNode, { id, title, author}: {id: string, title?: string, author?: string}) => {
			return prisma.book.update({ where: {id}, data: {title, author}})
		}
	}
}

const server = new ApolloServer({ 
	typeDefs, 
	resolvers, 
	cors: {
		origin: "*" // TODO: restrict to only from Nexrtjs server
	}
})

const startServer = async () => {
	const { url } = await server.listen({ port: process.env.PORT || 4000 })
	console.log(`🚀 Server ready at ${url}`)
}
startServer()
