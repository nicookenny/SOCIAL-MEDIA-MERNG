import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

const DeleteButton = ({ postId, commentId, callBack }) => {
	const [confirmOpen, setconfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrComment] = useMutation(mutation, {
		update(proxy) {
			setconfirmOpen(false);

			if (!commentId) {
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY,
				});
				let newData = data.getPosts.filter((p) => p.id !== postId);
				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: { getPosts: newData },
				});
			}

			if (callBack) callBack();
		},
		variables: {
			postId,
			commentId,
		},
	});

	return (
		<>
			<Popup
				content={commentId ? 'Delete comment' : 'Delete post'}
				inverted
				trigger={
					<Button
						as='div'
						color='red'
						floated='right'
						onClick={() => setconfirmOpen(true)}
					>
						<Icon name='trash' style={{ margin: 0 }} />
					</Button>
				}
			/>
			<Confirm
				open={confirmOpen}
				onCancel={() => setconfirmOpen(false)}
				onConfirm={deletePostOrComment}
			/>
		</>
	);
};

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

export default DeleteButton;
