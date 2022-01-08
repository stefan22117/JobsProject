import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import * as userActions from "../redux/actions/userActions";
import * as freelancerActions from "../redux/actions/freelancerActions";
import {Toaster} from 'react-hot-toast';
const styles = (theme) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.6em",
    },
    "*::-webkit-scrollbar-track": {
      backgroundColor: "#adefd1",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "#00203f",
    },
    "*": {
      textTransform: "none",
    },
    ".MuiMenu-paper": {
      backgroundColor: "#00203f",
    },
  },
});

const UserProvider = ({ children, user, getLoggedUser, ...props }) => {
  useEffect(() => {
    getLoggedUser();
  }, []);
  return (
    <>
    <Toaster position="top-right" toastOptions={
      {
        style:{
          backgroundColor:'#adefd1',
          color:'#00203f',
          width:'100vw'
        },
        iconTheme: {
          primary: '#00203f',
          secondary: '#adefd1',
        },
      }

    }/>
    {children}
    </>
    );
};
const mapStateToProps = (state) => ({
  ...state.usersReducer,
});

const mapDispatchToProps = {
  getLoggedUser: userActions.getLoggedUser,
  getUnreadMessages: freelancerActions.getUnreadMessages,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UserProvider));
