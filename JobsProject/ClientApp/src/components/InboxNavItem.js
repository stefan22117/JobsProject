import { Inbox } from "@material-ui/icons";
import { Badge } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import * as freelancerActions from "../redux/actions/freelancerActions";
let InboxNavItemHelper = (props) => {
    return (
      <>
          Inbox{" "}
            <Badge badgeContent={props.unreadMessages.length} max={99} color='secondary'>
              <Inbox style={{color:'#00203f'}}/>
            </Badge>
      </>
  );
};

const InboxNavItem = (props) => {
    if (props.loggedUser.id) {
        props.getUnreadMessages(props.loggedUser.id);
    }
    
    return <InboxNavItemHelper />;
};

const mapStateToPropsHelper = (state) => ({
//   loggedUser: state.usersReducer.user,
//   allFreelancers: state.freelancersReducer.list,

  unreadMessages: state.freelancersReducer.unreadMessages,
});
const mapDispatchToPropsHelper = {
  // getLoggedUser: userActions.getLoggedUser,
  getAllFreelancers: freelancerActions.fetchAll,

  getUnreadMessages: freelancerActions.getUnreadMessages,
};

InboxNavItemHelper = connect(mapStateToPropsHelper, mapDispatchToPropsHelper)(InboxNavItemHelper);

const mapStateToProps = (state) => ({
  loggedUser: state.usersReducer.user,
  allFreelancers: state.freelancersReducer.list,
});
const mapDispatchToProps = {
//   getLoggedUser: userActions.getLoggedUser,
//   getAllFreelancers: freelancerActions.fetchAll,

  getUnreadMessages: freelancerActions.getUnreadMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxNavItem);
