import React, { useState, useContext } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Form, Button } from 'semantic-ui-react';

import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/auth';

const Register = (props) => {
	const [errors, setErrors] = useState({});
	const context = useContext(AuthContext);
	const { onChange, onSubmit, values } = useForm(registerUser, {
		username: '',
		password: '',
		email: '',
		confirmPassword: '',
	});
	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(proxy, { data: { register: userData } }) {
			context.login(userData);
			props.history.push('/');
		},
		onError(err) {
			console.log(err.graphQLErrors[0].message.split(':')[1]);
			setErrors(err.graphQLErrors[0].message.split(':')[1]);
		},
		variables: values,
	});
	function registerUser() {
		addUser();
	}
	return (
		<div className='form-container'>
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Registro</h1>
				<Form.Input
					label='Nombre de usuario'
					placeholder='Nombre de usuario...'
					type='text'
					name='username'
					value={values.username}
					onChange={onChange}
				></Form.Input>
				<Form.Input
					label='Email'
					type='email'
					placeholder='Email'
					name='email'
					value={values.email}
					onChange={onChange}
				></Form.Input>
				<Form.Input
					label='Password'
					type='password'
					placeholder='Password...'
					name='password'
					value={values.password}
					onChange={onChange}
				></Form.Input>
				<Form.Input
					label='Confirm assword'
					type='password'
					placeholder='Confirm password...'
					name='confirmPassword'
					value={values.confirmPassword}
					onChange={onChange}
				></Form.Input>

				<Button primary type='submit'>
					Registrarse
				</Button>
			</Form>
			{Object.keys(errors).length > 0 ? (
				<div className='ui error message'>
					<ul className='list'>{errors}</ul>
				</div>
			) : (
				''
			)}
		</div>
	);
};

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Register;
