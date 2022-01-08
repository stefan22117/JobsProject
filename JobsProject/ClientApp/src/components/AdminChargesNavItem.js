import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as userActions from "../redux/actions/userActions";
import * as chargeActions from "../redux/actions/chargeActions";

const AdminChargesNavItem = ({ ...props }) => {
  useEffect(() => {
    if (props.user) {
      props.updateAdminChargesNumber(props.user.id);
    }
  }, [props.user]);
  return (
    <>
      {props.user.role == "admin" && (
        <>
          Admin Charges{" "}
          {props.adminChargesNumber > 0 && "(" + props.adminChargesNumber + ")"}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  adminChargesNumber: state.chargesReducer.adminChargesNumber,
});

const mapDispatchToProps = {
  getLoggedUser: userActions.getLoggedUser,
  getAllCharges: chargeActions.fetchAll,
  getChargesByUserId: chargeActions.fetchAllByUserId,
  updateAdminChargesNumber: chargeActions.updateAdminChargesNumber,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminChargesNavItem);
