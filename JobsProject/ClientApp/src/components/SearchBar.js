import {
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Paper,
  TextField,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import SelectTechnologies from "./SelectTechnologies";
import * as jobActions from "../redux/actions/jobActions";
import * as freelancerActions from "../redux/actions/freelancerActions";

const styles = (theme) => ({
  root: {
    backgroundColor: "#adefd1",
    // marginBottom:20,

    display: "flex",
    padding: 5,
  },
  checkBox: {
    '& .MuiSvgIcon-root':{
      color:"white"
    },
    '& .MuiTypography-root':{
      color:"#00203f"
    },
    flex: 0.1,
  },
  search: {
    '& .MuiOutlinedInput-root': {
      '& fieldset, &:hover fieldset, &.Mui-focused fieldset': {
        borderColor: '#00203f',
      },
      height:'100%'
    }
    ,
    '& .MuiInputBase-root':{
      color:'#00203f'
    },
    backgroundColor:'white',
    borderRadius:5,
    flex: 0.5,
  },
});

const SearchBar = ({ classes, ...props }) => {
  const [searchWord, setSearchWord] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [searchNotReserved, setSearchNotReserved] = useState(false);

  const handleSearchWord = (e) => {
    setSearchWord(e.target.value);
  };

  useEffect(() => {
    if (props.freelancers) {
      props.fillFreelancersList();
    } else {
      props.fillJobsList();
    }
  }, []);

  useEffect(() => {
    if (props.freelancers) {
      props.searchFreelancersByWordAndTech(searchWord, technologies);
    } else {
      props.searchJobsByWordAndTech(
        searchWord,
        technologies,
        searchNotReserved
      );
    }
  }, [searchWord, technologies, searchNotReserved]);

  return (

    <Paper className={classes.root}>
      <SelectTechnologies
        technologies={technologies}
        setTechnologies={setTechnologies}
        ></SelectTechnologies>

      {props.jobs ? (
        <FormControlLabel
        control={<Checkbox />}
        className={classes.checkBox}
          label="Only Not Reserved"
          checked={searchNotReserved}
          onChange={() => setSearchNotReserved(!searchNotReserved)}
          />
          ):
          <Box className={classes.checkBox}>
      </Box>
      }
      <TextField
        className={classes.search}
        variant="outlined"
        placeholder={"search..."}
        value={searchWord}
        onChange={handleSearchWord}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        />
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  // user: state.usersReducer.user,
  jobsList: state.jobsReducer.list,
});

const mapDispatchToProps = {
  fillJobsList: jobActions.fetchAll,
  fillFreelancersList: freelancerActions.fetchAll,
  searchJobsByWordAndTech: jobActions.fetchByWordAndTech,
  searchFreelancersByWordAndTech: freelancerActions.fetchByWordAndTech,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SearchBar));
