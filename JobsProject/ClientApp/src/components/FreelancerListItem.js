import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { VerifiedUser } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";

const styles = (theme) => ({
  root: {
    position: "relative",
    backgroundColor: "#adefd1",
  },
  link: {
    color: "#00203f",
    "&:hover": {
      textDecoration: "none",
      color: "#00203f",
    },
  },
  selectedChip: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    marginLeft: 5,
    color: "#adefd1",
  },
  freelancerHeader: {
    textAlign: "center",
  },
  descriptionPaper: {
    margin: "0 20px",
    color: "#adefd1",
    backgroundColor: "#00203f",
    padding: 5,
  },
});

const FreelancerListItem = ({
  id,
  name,
  emailVerified,
  description,
  classes,
  ...props
}) => {
  const [technologies, setTechnologies] = useState([]);

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

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Paper elevation={2} className={classes.root}>
      <Link to={"/freelancers/" + id} className={classes.link}>
        <Grid container>
          <Grid item md={12} sm={12} xs={12}>
            <h3 className={classes.freelancerHeader}>
              {name} {emailVerified && <VerifiedUser />}
            </h3>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Paper className={classes.descriptionPaper}>
              <i>
                {description?.length
                  ? description.length > (small ? 60 : 40)
                    ? (small
                        ? description.slice(0, 60)
                        : description.slice(0, 40)) + "..."
                    : description
                  : "No description..."}
              </i>
            </Paper>
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <hr />
          </Grid>
          <Grid
            item
            md={12}
            {...(!technologies.length && {
              container: true,
              justifyContent: "center",
            })}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {technologies.length ? (
                technologies.map((tech, i) => (
                  <Chip
                    className={classes.selectedChip}
                    key={i}
                    label={tech.name}
                  />
                ))
              ) : (
                <Typography
                  style={{
                    textAlign: "center",
                    color: "#00203f",
                  }}
                  variant="p"
                >
                  Freelancer has no technologies learned
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <hr />
          </Grid>

          {/* <hr />
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {technologies.map((tech, i) => (
          <Chip className={classes.selectedChip} key={i} label={tech.name} />
          ))}
          </Box>
        <hr /> */}
        </Grid>
      </Link>
    </Paper>
  );
};

export default withStyles(styles)(FreelancerListItem);
