import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Auth/Login';
import MatrixList from './components/Matrices/MatrixList';
import MatrixFormAdvancedHOT from './components/Matrices/MatrixFormAdvancedHOT';
import MatrixFormModular from './components/Matrices/MatrixFormModular';
import MatrixDetail from './components/Matrices/MatrixDetail';
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
            <RoleBasedRoute path="/matrices/new" exact component={MatrixFormAdvancedHOT} />
            <RoleBasedRoute path="/matrices/advanced" exact component={MatrixFormAdvancedHOT} />
            <RoleBasedRoute path="/matrices/advanced/:id" exact component={MatrixFormAdvancedHOT} />
            <RoleBasedRoute path="/matrices/modular" exact component={MatrixFormModular} />
            <RoleBasedRoute path="/matrices/modular/:id" exact component={MatrixFormModular} />
            <RoleBasedRoute path="/matrices/:id" exact component={MatrixDetail} />
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