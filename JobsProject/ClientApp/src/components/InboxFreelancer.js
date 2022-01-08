import { Button } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import * as userActions from "../redux/actions/userActions";
import * as freelancerActions from "../redux/actions/freelancerActions";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root:{
    textAlign:'center',
    fontSize:'1rem',
    overflowY: "hidden",
    backgroundColor: "#00203f",
    color: "white",
    marginBottom:5
  },
  freelancerInbox: {
    "&:hover": {
      backgroundColor: "white",
      color: "#00203f",
      cursor:'pointer'
    },
  },
  freelancerInboxSelected: {
    backgroundColor: "white",
    color: "#00203f",
    cursor:'pointer'
  },
});

const InboxFreelancer = ({
  setSelectedUserId,
  selectedUserId,
  user,
  classes,
  ...props
}) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    Promise.resolve(
      (async () => {
        if (selectedUserId && props?.loggedUser.id) {
          let mess = await axios.get(
            "chat/getMessages/" + selectedUserId + "/" + props?.loggedUser.id
          );
          setMessages(mess.data);
        }
      })()
    );
  }, []);

  useEffect(() => {}, [messages]);

  console.log("useerr", user);

  return (
    <>
      <div
        className={
          classes.root+" "+
          (selectedUserId == user.id
            ? classes.freelancerInboxSelected
            : classes.freelancerInbox)
        }
        key={user.id}
        variant="contained"
        onClick={() => setSelectedUserId(user.id)}
      >
        {user.name}{" "}
        {props.unreadMessages.filter((x) => x.userId == user.id).length > 0 &&
          props.unreadMessages.filter((x) => x.userId == user.id)[0].number !=
            0 &&
          "(" +
            props.unreadMessages.filter((x) => x.userId == user.id)[0].number +
            ")"}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  loggedUser: state.usersReducer.user,
  allFreelancers: state.freelancersReducer.list,
  unreadMessages: state.freelancersReducer.unreadMessages,
});
const mapDispatchToProps = {
  getLoggedUser: userActions.getLoggedUser,
  getAllFreelancers: freelancerActions.fetchAll,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(InboxFreelancer));
