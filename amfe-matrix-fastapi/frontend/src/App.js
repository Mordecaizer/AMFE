import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Auth/Login';
import MatrixList from './components/Matrices/MatrixList';
import MatrixFormModular from './components/Matrices/MatrixFormModular';
import AdminPanel from './components/Admin/AdminPanel';
import RoleBasedRoute from './components/RoleBasedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Switch>
            <Route path="/login" component={Login} />
            {/* Registro removido - solo admins pueden crear usuarios */}
            <RoleBasedRoute path="/matrices" exact component={MatrixList} />
            <RoleBasedRoute path="/matrices/new" exact component={MatrixFormModular} />
            <RoleBasedRoute path="/matrices/:id" exact component={MatrixFormModular} />
            <RoleBasedRoute path="/admin" exact allowedRoles={['admin']} component={AdminPanel} />
            <Route path="/" exact>
              <Redirect to="/matrices" />
            </Route>
            <Route path="*">
              <Redirect to="/matrices" />
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;