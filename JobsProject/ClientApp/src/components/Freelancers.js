import { Grid, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as freelancerActios from "../redux/actions/freelancerActions";
import FreelancerListItem from "./FreelancerListItem";
import SearchBar from "./SearchBar";
const Freelancers = (props) => {
  useEffect(() => {
    props.fillFreelancersList();
  }, []);
  return (
    <Grid container spacing={6}>
      <Grid item md={12} sm={12} xs={12}>
        <SearchBar freelancers={true} />
      </Grid>
      {props.freelancersList.filter((x) => x.id != props.loggedUser?.id)
        .length ? (
        props.freelancersList
          .filter((x) => x.id != props.loggedUser?.id)
          .map((freelancer, i) => (
            <Grid item md={6} sm={12} key={i}>
              <FreelancerListItem key={freelancer.id} {...freelancer} />
            </Grid>
          ))
      ) : (
        <Grid item md={12} sm={12} container justifyContent="center">
          <Grid item md={8} sm={8}>
            <Typography
              variant="h6"
              style={{
                backgroundColor: "#adefd1",
                color: "#00203f",
                borderRadius: 5,
                textAlign: "center",
              }}
            >
              There are no freelancers that match the search criteria
            </Typography>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  freelancersList: state.freelancersReducer.list,
  loggedUser: state.usersReducer.user,
});

const mapDispatchToProps = {
  fillFreelancersList: freelancerActios.fetchAll,
};
export default connect(mapStateToProps, mapDispatchToProps)(Freelancers);
