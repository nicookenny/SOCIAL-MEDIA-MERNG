import React, { useState, useContext } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Form, Button } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

import { useForm } from '../utils/hooks';
const Login = (props) => {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	const { onChange, onSubmit, values } = useForm(loginUserCb, {
		username: '',
		password: '',
	});

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(proxy, { data: { login: userData } }) {
			context.login(userData);
			props.history.push('/');
		},
		onError(err) {
            setErrors(err.graphQLErrors[0].message.split(':')[1]);
		},
		variables: values,
	});

	function loginUserCb() {
		loginUser();
	}

	return (
		<div className='form-container'>
			<Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
				<h1>Inicio de sesión</h1>
				<Form.Input
					label='Nombre de usuario'
					placeholder='Nombre de usuario...'
					type='text'
					name='username'
					value={values.username}
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

				<Button primary type='submit'>
					Iniciar sesión
				</Button>
			</Form>
			{Object.keys(errors).length > 0 ? (
				<div className='ui error message'>
					<ul className='list'>
						{errors}
					</ul>
				</div>
			) : (
				''
			)}
		</div>
	);
};

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Login;
