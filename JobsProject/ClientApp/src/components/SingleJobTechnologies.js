import { Button, Grid, Box, Chip } from '@material-ui/core';
import { withStyles} from '@material-ui/core/styles';
import React from 'react'
import { connect } from 'react-redux';


const styles = (theme)=>({
  selectedChip: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    marginLeft: 5,
  },
})


const SingleJobTechnologies = ({technologiesList,reserved, classes, ...props}) => {
    return (
        <>
            {/* {props.technologiesList.length ? (
            props.technologiesList.map((tech) => (
              <Grid item key={tech.id}>
                <Button variant="contained" color="primary">
                  {tech.name}
                </Button>
              </Grid>
            ))
          ) : (
            <>Nema tehnologija...</>
          )} */}

<Box sx={{ display: "flex", flexWrap: "wrap" , justifyContent:'center'}}>
          {technologiesList.length ? 
          technologiesList.map((tech, i) => (
            <Chip
            className={classes.selectedChip}
            style={{ color: reserved ? "orange" : "#adefd1" }}
            key={i}
            label={tech.name}
            />
            )):(
              <>Nema tehnologija...</>
          )}
        </Box>


        </>
    )
}
const mapStateToProps = (state) => ({
    technologiesList: state.technologiesReducer.technologiesByJobId,
    bidsList: state.bidsReducer.list,
  });
  
  const mapDispatchToProps = {
    // getSingleJob: jobActions.findById,
    // technologiesByJobId: technologyActions.fetchByJobId,
    // bidsByJobId: bidActions.fetchByJobId,
  };
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SingleJobTechnologies));
  