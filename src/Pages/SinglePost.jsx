import React, { useContext, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import {
	Card,
	Grid,
	Image,
	Button,
	Label,
	Icon,
	Form,
} from 'semantic-ui-react';

import moment from 'moment';
import LikeButton from '../Components/LikeButton';

import { AuthContext } from '../context/auth';
import DeleteButton from '../Components/DeleteButton';

const SinglePost = (props) => {
	const { id: postId } = useParams();
	let history = useHistory();
	const { user } = useContext(AuthContext);
	const commentInputRef = useRef(null);

	const [comment, setComment] = useState('');

	const { data } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update() {
			setComment('');
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment,
		},
	});

	const deletePostCallback = () => {
		history.push('/');
	};
	let postMarkup;

	if (!data?.getPost) {
		postMarkup = <p> Loading...</p>;
	} else {
		console.log(data.getPost);
		const {
			id,
			body,
			createdAt,
			username,
			likeCount,
			commentCount,
			likes,
			comments,
		} = data.getPost;

		let post = {
			likes,
			likeCount,
			id,
		};

		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
							src='https://react.semantic-ui.com/images/avatar/large/molly.png'
							size='small'
							float='right'
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
								<Card.Description>{body}</Card.Description>
								<hr />
								<Card.Content extra>
									<LikeButton user={user} post={post} />
									<Button
										as='div'
										labelPosition='right'
										onClick={() => console.log('comment')}
									>
										<Button basic color='blue'>
											<Icon name='comments' />
										</Button>
										<Label basic color='blue' pointing='left'>
											{commentCount}
										</Label>
									</Button>
									{user && user.username === username && (
										<DeleteButton postId={id} callBack={deletePostCallback} />
									)}
								</Card.Content>
							</Card.Content>
						</Card>
						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a comment</p>
									<Form>
										<div class='ui action input fluid'>
											<input
												type='text'
												placeholder='Post a comment'
												name='comment'
												value={comment}
												onChange={(e) => setComment(e.target.value)}
												ref={commentInputRef}
											/>
											<button
												type='submit'
												className='ui button teal'
												disabled={comment.trim() === ''}
												onClick={submitComment}
											>
												Post a comment
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}
						{comments.map((comment) => (
							<Card fluid key={comment.id}>
								<Card.Content>
									{user && user.username === comment.username && (
										<DeleteButton postId={id} commentId={comment.id} />
									)}
									<Card.Header>{comment.username}</Card.Header>
									<Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
									<Card.Description>{comment.body}</Card.Description>
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
	return postMarkup;
};

const SUBMIT_COMMENT_MUTATION = gql`
	mutation($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`;

const FETCH_POST_QUERY = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;
export default SinglePost;
