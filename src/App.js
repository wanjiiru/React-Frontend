import './App.css';
import React ,{Component} from "react";
import CssBaseline from "@mui/material/CssBaseline"
import { Route, Switch } from 'react-router-dom';
import Login from './components/login';
import ProtectedRoute from './components/protectedRoute';
import CustomerLeads from './components/customerLeads';
import CustomSnackbar from './components/snackBar';

class App extends Component{
  state = {
    toastInfo:{
      open:false,
      toastClass:"info",
      message:""
    }
  }
  handleToastClose = () => {
    let { toastInfo } = this.state;
    toastInfo.open = false;
    this.setState({ toastInfo });
  }
  handleOpenToast = (message, toastClass) => {
    let { toastInfo } = this.state;
    toastInfo.open = true;
    toastInfo.message = message;
    toastInfo.toastClass = toastClass;
    this.setState({ toastInfo });
  }
  render() {
    const { toastInfo } = this.state;
    console.log(toastInfo);
    return(
      <React.Fragment>
        <CssBaseline/>

        <Switch>
          <Route path="/auth/login/" exact render={(props) => <Login {...props} handleOpenToast={this.handleOpenToast} />} />
          <ProtectedRoute path="/" exact render={(props) => <CustomerLeads {...props} handleOpenToast={this.handleOpenToast} />}   />
        </Switch>
        <CustomSnackbar toastInfo={toastInfo} handleToastClose={this.handleToastClose} />
      </React.Fragment>
  );
  }
}

export default App;
