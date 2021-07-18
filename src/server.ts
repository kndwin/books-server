const { ApolloServer, gql } = require('apollo-server')

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

server.listen().then(({ url }: any) => {
	console.log(`🚀 Server ready at ${url}`)
})
