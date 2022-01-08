import { Box, Button, Chip, Grid, Paper, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router";
import * as freelancerActions from "../redux/actions/freelancerActions";

const styles = (theme) => ({
  root: {
    position: "relative",
    backgroundColor: "#adefd1",
  },
  selectedChip: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    marginLeft: 5,
    color: "#adefd1",
  },
  freelancerHeader: {
    textAlign: "center",
    color: "#00203f",
  },
  descriptionPaper: {
    margin: 20,
    color: "#adefd1",
    backgroundColor: "#00203f",
    padding: 5,
  },
  avatarImageRing: {
    width: 220,
    height: 220,
    borderRadius: "50%",
    backgroundColor: "#00203f",
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    borderRadius: "50%",
    margin: 20,
  },
  sendMessageBtn: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    margin: 10,
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
    },
  },
});
const SingleFreelancer = ({
  id,
  name,
  avatar,
  description,
  classes,
  ...props
}) => {
  const params = useParams();
  const [technologies, setTechnologies] = useState([]);
  const history = useHistory();
  const handleSendMessage =async  (freelancerId) => {
    await props.chooseFreelancerForMessage(freelancerId);
    await history.push("/inbox");
  };

  useEffect(() => {
    Promise.resolve(
      (async () => {
        const response = await axios.get(
          "api/technologies/byFreelancerId/" + id
        );
        setTechnologies(response.data);
      })()
    );
  }, [id]);

  useEffect(() => {
    props.getSingleFreelancer(params.id);
  }, []);

  return (
    <Paper elevation={2} className={classes.root}>
      <Grid container style={{ height: "40%" }}>
        <Grid
          md={4}
          item
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <div className={classes.avatarImageRing}>
            <img
              width={200}
              src={
                "/media/freelancerAvatar/" +
                (avatar ? avatar : "unknown_user.jpg")
              }
              alt="FreelancerAvatar"
              className={classes.avatarImage}
            />
          </div>
        </Grid>
        <Grid container item md={8}>
          <Grid container>
            {props?.loggedUser.id && props.loggedUser.id != id ? (
              <>
                <Grid item md={8}>
                  <h2 className={classes.freelancerHeader}>{name}</h2>
                </Grid>
                <Grid item md={4}>
                  <Button
                    className={classes.sendMessageBtn}
                    onClick={()=>handleSendMessage(id)}
                  >
                    Send Message
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item md={12} sm={12} xs={12}>
                  <h2 className={classes.freelancerHeader}>{name}</h2>
                </Grid>
              </>
            )}
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Paper className={classes.descriptionPaper}>
              <i>{description ?? "No description..."}</i>
            </Paper>
          </Grid>
        </Grid>
          <Grid item md={12} sm={12} xs={12}>
          <hr />
          </Grid>
        <Grid item md={12} {...(!technologies.length && {container:true, justifyContent:'center'})}>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {
              technologies.length ?
            technologies.map((tech, i) => (
              <Chip
                className={classes.selectedChip}
                key={i}
                label={tech.name}
              />
            )):
            <Typography
                  style={{
                    textAlign: "center",
                    color: "#00203f",
                  }}
                  variant="h6"
                >
                  Freelancer has no technologies learned
                </Typography>

            }
          </Box>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <hr />
          </Grid>
      </Grid>
    </Paper>
  );
};
const mapStateToProps = (state) => ({
  ...state.freelancersReducer.singleFreelancer,
  loggedUser: state.usersReducer.user,
});
const mapDispatchToProps = {
  getSingleFreelancer: freelancerActions.findById,
  chooseFreelancerForMessage: freelancerActions.chooseForMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SingleFreelancer));
