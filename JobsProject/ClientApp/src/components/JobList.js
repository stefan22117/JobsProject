import { Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as jobsActios from "../redux/actions/jobActions";
import JobListItem from "./JobListItem";
import SearchBar from "./SearchBar";

const JobList = ({ user, ...props }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState("");
  useEffect(() => {
    switch (window.location.pathname) {
      case "/posted-jobs":
        console.log("/posted-jobs", user.id);
        props.fillJobsListUserPosted(user.id);
        setEmptyMessage("You haven't posted a single job");
        break;

      case "/bidded-jobs":
        props.fillJobsListUserBidded(user.id);
        setEmptyMessage("You haven't bidded a single job");
        break;
      case "/finished-jobs":
        props.fillJobsListUserFinished(user.id);
        setEmptyMessage("You haven't finished a single job");
        break;

      default:
        setShowSearch(true);
        props.fillJobsList();
        setEmptyMessage("There are no jobs that match the search criteria");
    }
  }, [user]);

  return (
    <Grid container spacing={6}>
      {showSearch && (
        <Grid
          item
          md={12}
          sm={12}
          style={{
            paddingBottom: 0,
          }}
        >
          <SearchBar jobs={true} />
        </Grid>
      )}
      {props.jobsList.length ? (
        props.jobsList.map((job, i) => (
          <Grid item md={6} sm={12} key={i}>
            <JobListItem key={job.id} {...job} />
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
            {emptyMessage}
          </Typography>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  jobsList: state.jobsReducer.list,
});

const mapDispatchToProps = {
  fillJobsList: jobsActios.fetchAll,
  fillJobsListUserPosted: jobsActios.fetchAllUserPosted,
  fillJobsListUserBidded: jobsActios.fetchAllUserBidded,
  fillJobsListUserFinished: jobsActios.fetchAllUserFinished,
};
export default connect(mapStateToProps, mapDispatchToProps)(JobList);
