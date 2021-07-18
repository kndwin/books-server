import { ApolloServer, gql } from 'apollo-server'

const typeDefs = gql`
	type Book {
		title: String
		author: String
	}

	type Query {
		books: [Book]
	}
`

const books = [
	{ title: 'Great expectations', author: 'Charles Dickens' },
	{ title: 'Below average expectations', author: 'Darles Chickens' }
]

const resolvers = {
	Query: {
		books: () => books
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
