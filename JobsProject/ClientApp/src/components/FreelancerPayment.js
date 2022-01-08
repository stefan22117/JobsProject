import { Button, Grid, Paper } from "@material-ui/core";
import { Person, AttachMoney } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router";
import * as jobActions from "../redux/actions/jobActions";
import * as userActions from "../redux/actions/userActions";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const styles = (theme) => ({
  text: {
    color: "#00203f",
    textAlign: "center",
  },
  button:{
      color:'#adefd1',
      backgroundColor:'#00203f',
      '&:hover':{
        color:'#adefd1',
        backgroundColor:'#00203f',
      }
  }
});

const FreelancerPayment = ({
  loggedUser,
  bidFreelancerJob,
  classes,
  ...props
}) => {
  const history = useHistory();
  const params = useParams();
  useEffect(() => {
    props.getBidFreelancerJob(params.id);
  }, []);
  const total =
    bidFreelancerJob?.activeBid?.amount /
    bidFreelancerJob?.job?.valute?.toDinars;

  const formatTotal = (total, decimals = 2) => {
    return (total + "").indexOf(".") != -1
      ? (total + "").slice(0, (total + "").indexOf(".") + decimals + 1)
      : total;
  };

  const payFreelancerHandler = async () => {
    if (bidFreelancerJob?.job?.finished) {
      toast.error("You have already paid a freelancer for this job");
      return;
    }

    if (loggedUser.total - total < 0) {
      toast.error(
        "You need: " +
          formatTotal(total - loggedUser.total) +
          " " +
          loggedUser?.valute?.namePlural.toLowerCase() +
          " more"
      );
      return;
    }
    await props.completeJob(params.id);
    toast.success(
      "You paid the user " +
        bidFreelancerJob.user.name +
        " " +
        formatTotal(total) +
        loggedUser?.valute?.namePlural.toLowerCase()
    );
    history.push("/jobs/" + params.id);
    await props.getLoggedUser();
  };
  return (
    <Paper
      elevation={2}
      style={{
        backgroundColor: "#adefd1",
        marginBottom: 20,

        display: "flex",
        padding: 5,
      }}
    >
      <Grid
        containter
        style={{
          width: "100%",
        }}
      >
        <Grid item md={12}>
          <h1 className={classes.text}>{bidFreelancerJob?.job?.title}</h1>
        </Grid>

        <Grid container item md={12}>
          <Grid
            item
            container
            md={4}
            sm={6}
            xs={12}
            alignItems="center"
            justifyContent="center"
          >
            <h3 className={classes.text}>
              Your balance: {loggedUser.total}
              {loggedUser?.valute?.label}
            </h3>
          </Grid>
          <Grid
            item
            md={4}
            sm={6}
            xs={12}
            style={{
              color: "#00203f",
            }}
          >
            <p className={classes.text}>
              Payment: {bidFreelancerJob?.job?.paymentType}
            </p>
            <p className={classes.text}>
              Price: {bidFreelancerJob?.activeBid?.amount}{" "}
              {bidFreelancerJob?.job?.valute?.label}
            </p>
            {loggedUser?.valute?.id != bidFreelancerJob?.job?.valute?.id && (
              <p className={classes.text}>
                Converted: {formatTotal(total)} {loggedUser?.valute?.label}{" "}
              </p>
            )}

            <p className={classes.text}>
              Your Bilance:{" "}
              {(loggedUser.total - total + "").indexOf(".") != -1
                ? (loggedUser.total - total + "").slice(
                    0,
                    (loggedUser.total - total + "").indexOf(".") + 3
                  )
                : loggedUser.total - total}{" "}
              {loggedUser?.valute?.label}{" "}
            </p>
          </Grid>
          <Grid item container md={4} sm={12} xs={12}>
            <Grid item
            container 
            justifyContent="center" 
            alignItems="center"
            md={12}>
              <Button
              className={classes.button}
              style={{
                  marginBottom:5
              }}
                variant="contained"
                color="primary"
                onClick={() =>
                  history.push("/freelancers/" + bidFreelancerJob?.user?.id)
                }
              >
                <Person /> {bidFreelancerJob?.user?.name}
              </Button>
            </Grid>
            <Grid item 
            container 
            justifyContent="center" 
            alignItems="center"
            md={12} >
              <Button
              className={classes.button}
                variant="contained"
                color="primary"
                disabled={bidFreelancerJob?.job?.finished}
                onClick={() => payFreelancerHandler(bidFreelancerJob?.job?.id)}
              >
                Pay{" "}<AttachMoney />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  loggedUser: state.usersReducer.user,
  technologiesList: state.technologiesReducer.technologiesByJobId,
  bidsList: state.bidsReducer.list,
  bidFreelancerJob: state.jobsReducer.singleJob,
});

const mapDispatchToProps = {
  getSingleJob: jobActions.findById,
  getBidFreelancerJob: jobActions.findByCompletedJobId,
  completeJob: jobActions.completeJob,
  getLoggedUser: userActions.getLoggedUser,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FreelancerPayment));
