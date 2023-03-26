import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCurrentUser } from "../services/httpService";

const ProtectedRoute = ({ component: Component, render, ...rest }) => {
    return (
        <Route {...rest} render={props=>{
            if (!getCurrentUser())
                return <Redirect to={{
                    pathname: "/auth/login/",
                    state: {from: props.location}
                }} /> ;
            return Component ? <Component {...props} /> : render(props);
        }}
        />
    )
}

export default ProtectedRoute;