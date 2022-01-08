import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Paper, Button, Grid, IconButton, Box, Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import * as jobActions from "../redux/actions/jobActions";
import * as technologyActions from "../redux/actions/technologyActions";
import * as bidActions from "../redux/actions/bidActions";
import PlaceBid from "./PlaceBid";
import SingleJobTechnologies from "./SingleJobTechnologies";
import axios from "axios";
import { Edit } from "@material-ui/icons";
import SingleJobBids from "./SingleJobBids";

const styles = (theme) => ({
  job: {
    backgroundColor: "#adefd1",
    color: "#00203f",
  },
  jobHeader: {
    textAlign: "center",
  },
  jobHeaderDiv: {
    position: "relative",
    paddingBottom: 10,
    paddingTop: 10,
  },
  textDescription: {
    backgroundColor: "white",
    margin: 10,
    padding: 2,
    borderRadius: 5,
    height: "5rem",
    wordWrap: "break-word",
  },
  textAmounts: {
    textAlign: "center",
    backgroundColor: "white",
    margin: 10,
    padding: 2,
    borderRadius: 5,
  },
  editJobBtn: {
    position: "absolute",
    // display:"none",
    backgroundColor: "#00203f",
    color: "#adefd1",
    // margin: 10,
    // right:10,
    top: 10,
    right: 10,
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
      display: "block",
    },
  },
  bidForJobBtn: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    marginBottom:5,
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
      // display:"block",
    },
  },
  declineJobBidBtn: {
    backgroundColor: "red",
    color: "#adefd1",
    marginBottom:5,
    "&:hover": {
      backgroundColor: "red",
      color: "#adefd1",
      // display:"block",
    },
  },
});

const SingleJob = ({ job, classes, ...props }) => {
  const params = useParams();
  const [bidClicked, setBidClicked] = useState(false);
  const history = useHistory();
  useEffect(() => {
    props.getSingleJob(params.id);
    props.getTechnologiesByJobId(params.id);
  }, []);


  return (
    <>

      <Paper elevation={2} className={classes.job}
      style={{
        backgroundColor: job.reserved ? 'orange': '#adefd1'
      }}
      >
        <Grid className={classes.jobHeaderDiv}>
          <h3 className={classes.jobHeader}>{job.title}</h3>
        {job.reserved && <p style={{textAlign:'center'}}>
          <hr />
          <i>This job has been reserved.</i>
          <hr />
          
          </p>}
          {props.loggedUser.id == job.userId && (
            <IconButton
            style={{
              color:job.reserved ? 'orange': '#adefd1'
            }}
              className={classes.editJobBtn}
              variant="contained"
              color="primary"
              onClick={() => history.push("/edit-job/" + job.id)}
            >
              <Edit />
            </IconButton>
          )}
        </Grid>

        <p className={classes.textDescription}>{job.description}</p>

        <Grid container>
          <Grid item md={3} sm={3} xs={3}>
            <p className={classes.textAmounts}>
              <span style={{ color: job.reserved ? "orange" : "#adefd1" }}>
                Min.{" "}
              </span>{" "}
              {job.minAmount}
            </p>
          </Grid>
          <Grid item md={3} sm={3} xs={3}>
            <p className={classes.textAmounts}>
              <span style={{ color: job.reserved ? "orange" : "#adefd1" }}>
                Max.{" "}
              </span>
              {job.maxAmount}
            </p>
          </Grid>
          <Grid item md={3} sm={3} xs={3}>
            <p className={classes.textAmounts}>
              <span style={{ color: job.reserved ? "orange" : "#adefd1" }}>
                Valute{" "}
              </span>
              {job.valute?.label}
            </p>
          </Grid>
          <Grid item md={3} sm={3} xs={3}>
            <p className={classes.textAmounts}>
              <span style={{ color: job.reserved ? "orange" : "#adefd1" }}>
                Type{" "}
              </span>
              {job.paymentType}
            </p>
          </Grid>
        </Grid>

            <Grid container justifyContent="center" alignItems="center">

        {job.reserved && props.loggedUser.id == job.userId && (
          <Button
          className={classes.bidForJobBtn}
          style={{
            color:'orange'
          }}
          onClick={() => history.push("/freelancers/payment/" + job.id)}
          >
            Pay to freelancer
          </Button>
        )}
        </Grid>


        <hr />
        <SingleJobTechnologies reserved={job.reserved} />
        <hr />




        <Grid container justifyContent="center">
          {props.loggedUser.id != job.userId &&
            (bidClicked ? (
              <Button
                className={classes.declineJobBidBtn}
                variant="contained"
                onClick={() => setBidClicked(false)}
              >
                Decline bid
              </Button>
            ) : (
              <Button
                className={classes.bidForJobBtn}
                variant="contained"
                disabled={job.reserved}
                onClick={() => setBidClicked(true)}
              >
                Bid for this job
              </Button>
            ))}
        </Grid>

        {bidClicked && (
          <PlaceBid
            title={job.title}
            minAmount={job.minAmount}
            maxAmount={job.maxAmount}
          />
        )}
      </Paper>
      <SingleJobBids job={job} />
    </>
  );
};
const mapStateToProps = (state) => ({
  loggedUser: state.usersReducer.user,
  technologiesList: state.technologiesReducer.technologiesByJobId,
  bidsList: state.bidsReducer.list,
  job: state.jobsReducer.singleJob,
});

const mapDispatchToProps = {
  getSingleJob: jobActions.findById,
  getTechnologiesByJobId: technologyActions.fetchByJobId,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SingleJob));
