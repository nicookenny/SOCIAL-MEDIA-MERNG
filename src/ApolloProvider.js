import App from './App';
import { ApolloClient } from '@apollo/client';

import { InMemoryCache } from '@apollo/client';
import { createHttpLink } from '@apollo/client';

import { ApolloProvider } from '@apollo/client';

import { setContext } from 'apollo-link-context';
const authLink = setContext(() => {
	const token = localStorage.getItem('token');
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	};
});
const httpLink = createHttpLink({
	uri: 'https://pure-cove-63652.herokuapp.com/',
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
