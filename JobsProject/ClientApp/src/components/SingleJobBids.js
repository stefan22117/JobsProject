import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Paper, Grid, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import * as bidActions from "../redux/actions/bidActions";
import * as jobActions from "../redux/actions/jobActions";
import * as technologyActions from "../redux/actions/technologyActions";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Cancel } from "@material-ui/icons";

const styles = (theme) => ({
  root: {
    width: "100%",
    backgroundColor: "#adefd1",
    color: "#00203f",
    padding: 16,
    marginTop: 16,
  },

  bid: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    padding: 5,
    position: "relative",
    "&:hover .MuiSvgIcon-root": {
      display: "inline",
      cursor: "pointer",
    },
  },
  hireFreelancerBtn: {
    backgroundColor: "#adefd1",
    color: "#00203f",
    "&:hover": {
      backgroundColor: "#adefd1",
      color: "#00203f",
    },
  },
  amount: {
    backgroundColor: "#adefd1",
    color: "#00203f",
    borderRadius: 5,
    fontSize: "3rem",
  },
  freelancerLink: {
    color: "#adefd1",
    fontSize: "2rem",
    "&:hover": {
      color: "#adefd1",
      textDecoration: "none",
    },
  },
  textMessage: {
    backgroundColor: "white",
    marginTop: 10,
    padding: 2,
    borderRadius: 5,
    height: "5rem",
    wordWrap: "break-word",
    color: "black",
  },
  removeBidBtn: {
    color: "#adefd1",
    position: "absolute",
    right: 10,
    top: 10,
    display: "none",
  },
});

const SingleJobBids = ({ job, classes, ...props }) => {
  useEffect(() => {
    if (job.id) {
      props.getBidsByJob(job.id);
    }
  }, [job.id]);

  const hireFreelancerHandler = async (jobId, user) => {
    await axios.post(
      "/api/freelancers/hireFreelancer/" + jobId + "/" + user.id
    );
    toast.success("You have hired a freelancer: " + user.name);

    props.getSingleJob(jobId);
    props.getBidsByJob(jobId);
    props.getTechnologiesByJob(jobId);
  };

  const handleRemoveBid = (bidId) => {
    props
      .removeBid(bidId)
      .then(() => {
        toast.success("You have successfully removed your bid");
        props.getBidsByJob(job.id);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Removing bid went wrong");
      });
  };
  return (
    <Grid container justifyContent="center">
      <Paper
        elevation={2}
        className={classes.root}
        style={{ backgroundColor: job.reserved ? "orange" : "white" }}
      >
        <Grid container spacing={2}>
          {props.bidsList.length ? (
            props.bidsList.map((b, i) => (
              <Grid key={i} item sm={12} md={6}>
                <Paper key={b.id} className={classes.bid}>
                  {props?.loggedUser?.id == b?.user?.id && (
                    <Cancel
                      style={{ color: job.reserved ? "orange" : "#adefd1" }}
                      className={classes.removeBidBtn}
                      onClick={() => handleRemoveBid(b.id)}
                    />
                  )}
                  <Grid item container>
                    <Grid item md={9} sm={12}>
                      <Grid container>
                        <Grid
                          container
                          item
                          md={
                            props?.loggedUser?.id == job.userId && !job.reserved
                              ? 8
                              : 12
                          }
                          sm={6}
                          justifyContent="center"
                          alignItems="center"
                        >
                          {props?.loggedUser?.id == b?.user?.id ? (
                            <i
                              className={classes.freelancerLink}
                              style={{
                                color: job.reserved ? "orange" : "#adefd1",
                              }}
                            >
                              This is your bid...
                            </i>
                          ) : (
                            <Link
                              to={"/freelancers/" + b?.user.id}
                              className={classes.freelancerLink}
                              style={{
                                color: job.reserved ? "orange" : "#adefd1",
                              }}
                            >
                              {" "}
                              {b?.user.name}
                            </Link>
                          )}
                        </Grid>

                        <Grid
                          container
                          item
                          sm={6}
                          md={
                            props?.loggedUser?.id == job.userId && !job.reserved
                              ? 4
                              : "auto"
                          }
                          justifyContent="center"
                        >
                          {props?.loggedUser?.id == job.userId &&
                            !job.reserved && (
                              <Button
                                className={classes.hireFreelancerBtn}
                                color="primary"
                                variant="contained"
                                onClick={() =>
                                  hireFreelancerHandler(job.id, b?.user)
                                }
                              >
                                Hire freelancer
                              </Button>
                            )}
                        </Grid>
                      </Grid>

                      <Grid item>
                        <p className={classes.textMessage}>{b.message}</p>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={12}
                      container
                      justifyContent="center"
                      alignItems="center"
                    >
                      <span
                        className={classes.amount}
                        style={{
                          backgroundColor: job.reserved ? "orange" : "#adefd1",
                        }}
                      >
                        {job.paymentType == "hourly"
                          ? b.amount + " " + job.valute?.label + "/h"
                          : b.amount + " " + job.valute?.label}
                      </span>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))
          ) : props.loggedUser.id == job.userId ? (
            <Grid container item justifyContent="center">
              <p style={{ margin: 0, color:'#00203f' }}>You don't have bids for this job</p>
            </Grid>
          ) : (
            <Grid container item justifyContent="center">
              <p style={{ margin: 0, color:'#00203f' }}>Be first who will bid...</p>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  loggedUser: state.usersReducer.user,
  bidsList: state.bidsReducer.list,
});

const mapDispatchToProps = {
  getBidsByJob: bidActions.fetchByJobId,
  getSingleJob: jobActions.findById,
  getTechnologiesByJob: technologyActions.fetchByJobId,
  removeBid: bidActions.remove,
  //   updateSingleBid: bidActions.updateSingleBid,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SingleJobBids));
