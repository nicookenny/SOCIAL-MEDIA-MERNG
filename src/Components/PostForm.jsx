import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { Form, Button } from 'semantic-ui-react';
import { useForm } from '../utils/hooks';

import { CREATE_POST_MUTATION } from '../utils/graphql';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

const PostForm = () => {
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		body: '',
	});
	const [errors, setErrors] = useState('');

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
				data: { getPosts: [result.data.createPost, ...data.getPosts] },
			});
			values.body = '';
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].message);
		},
	});

	function createPostCallback() {
		createPost();
	}
	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						placeholder='Tu mensaje'
						name='body'
						error={error?error:null}
						onChange={onChange}
						value={values.body}
					/>

					<Button type='submit' color='teal'>
						Enviar
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className='ui error message'>
					<ul className='list'>{errors}</ul>
				</div>
			)}
		</>
	);
};

export default PostForm;
