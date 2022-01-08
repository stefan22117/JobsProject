import React from "react";
import { NavItem } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as userActions from "../redux/actions/userActions";
import * as freelancerActions from "../redux/actions/freelancerActions";
import * as chargeActions from "../redux/actions/chargeActions";
import { Money } from "@material-ui/icons";
let ChargeNavItemHelper = (props) => (
  <NavItem>
    <Link tag={Link} className="text-dark" to="/charge">
      Charge{" "}
      {props.uncheckedChargesNumber ? (
        "(" + props.uncheckedChargesNumber + ")"
      ) : (
        <Money />
      )}
    </Link>
  </NavItem>
);

const ChargeNavItem = (props) => {
  if (props.loggedUser.id) {
    props.getUncheckedCharges(props.loggedUser.id);
  }

  return <ChargeNavItemHelper />;
};

const mapStateToPropsHelper = (state) => ({
  //   loggedUser: state.usersReducer.user,
  //   allFreelancers: state.freelancersReducer.list,
  uncheckedChargesNumber: state.chargesReducer.uncheckedChargesNumber,
//   unreadMessages: state.freelancersReducer.unreadMessages,
});
const mapDispatchToPropsHelper = {
  // getLoggedUser: userActions.getLoggedUser,
  getAllFreelancers: freelancerActions.fetchAll,

//   getUncheckedCharges: chargeActions.getUncheckedCharges,
//   getUnreadMessages: freelancerActions.getUnreadMessages,
};

ChargeNavItemHelper = connect(
  mapStateToPropsHelper,
  mapDispatchToPropsHelper
)(ChargeNavItemHelper);

const mapStateToProps = (state) => ({
  loggedUser: state.usersReducer.user,
//   allFreelancers: state.freelancersReducer.list,
});
const mapDispatchToProps = {
  //   getLoggedUser: userActions.getLoggedUser,
  //   getAllFreelancers: freelancerActions.fetchAll,
  getUncheckedCharges: chargeActions.getUncheckedCharges,
//   getUnreadMessages: freelancerActions.getUnreadMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChargeNavItem);
