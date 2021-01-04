import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';

import AuthRoute from './utils/AuthRoute';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import MenuBar from './Components/MenuBar';
import SinglePost from './Pages/SinglePost';


function App() {
	return (
		<AuthProvider>
			<Router>
				<Container>
					<MenuBar />
					<Route exact path='/' component={Home} />
					<AuthRoute exact path='/login' component={Login} />
					<AuthRoute exact path='/register' component={Register} />
					<Route exact path='/posts/:id' component={SinglePost} />
				</Container>
			</Router>
		</AuthProvider>
	);
}

export default App;
