import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

import PostCard from '../Components/PostCard.jsx';
import PostForm from '../Components/PostForm';

import { FETCH_POSTS_QUERY } from '../utils/graphql';

const Home = () => {
	const { loading, data } = useQuery(FETCH_POSTS_QUERY);
	const context = useContext(AuthContext);

	return (
		<Grid columns={3}>
			<Grid.Row className='page-title'>
				<h1>Recent posts</h1>
			</Grid.Row>
			{context.user && (
				<Grid.Column>
					<PostForm />
				</Grid.Column>
			)}
			<Grid.Row>
				{loading ? (
					<h1>Loading posts...</h1>
				) : (
					<Transition.Group>
						{data?.getPosts?.map((post) => (
							<Grid.Column key={post.id} style={{ marginBottom: '20px' }}>
								<PostCard post={post} />
							</Grid.Column>
						))}
					</Transition.Group>
				)}
			</Grid.Row>
		</Grid>
	);
};

export default Home;
