import {
  Grid,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  FormLabel,
  FormControl,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { connect } from "react-redux";
import { toast } from "react-hot-toast";
import { withStyles } from "@material-ui/core/styles";
import * as valuteActions from "../redux/actions/valuteActions";
import * as jobActions from "../redux/actions/jobActions";
import * as technologyActions from "../redux/actions/technologyActions";
import ProfileChosenTechnologies from "./ProfileChosenTechnologies";
import ProfileUnchosenTechnologies from "./ProfileUnchosenTechnologies";

const stylesHelper = {
  input: {
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        borderColor: "#00203f",
      },
      height: "100%",
    },
    "& .MuiInputBase-root": {
      color: "#00203f",
    },
    background: "linear-gradient(270deg, #00203f, #adefd1)",
    borderRadius: 5,
    flex: 0.5,
    marginBottom: 5,
  },
};

const styles = (theme) => ({
  root: {
    background: "linear-gradient(180deg, transparent, #adefd1)",
    marginBottom: 20,

    display: "flex",
    padding: 5,
    width: "50vw",
  },
  postEditButton: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    margin: 10,
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
    },
  },

  input: stylesHelper.input,
  minMaxInput: {
    ...stylesHelper.input,
    width: "100%",
    "& .MuiInputBase-root": {
      color: "#adefd1",
      direction: "rtl",
    },
  },
  formHeader: {
    textAlign: "center",
    color: "#adefd1",
  },
  adornmentVisibility: {
    color: "#adefd1",
  },
  error: {
    // color: "#00203f",
    color: "red",
    fontSize: "1rem",
    textAlign: "center",
  },
  selectValutesRoot: {
    color: "#00203f",
    background: "linear-gradient(270deg, #00203f, #adefd1)",
    borderRadius: 5,
    width: "100%",
    "& label.MuiFormLabel-root": {
      color: "#00203f",
      marginLeft: "10px",
    },
    "& .MuiSelect-icon": {
      color: "#adefd1",
    },

    "&.MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        borderColor: "#00203f",
      },
    },
  },
  selectMenuItem: {
    "&:hover": {
      backgroundColor: "#adefd1",
      color: "#00203f",
    },
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "#adefd1",
      color: "#00203f",
    },
    overflowY: "hidden",
    backgroundColor: "#00203f",
    color: "#adefd1",
  },
  radioButton: {
    "& .MuiSvgIcon-root, .MuiTypography-root": {
      color: "#adefd1",
    },
    "& .Mui-checked": {
      color: "#00203f",
    },
  },
  formLabel: {
    color: "#adefd1",
    "&.Mui-focused": {
      color: "#adefd1",
    },
  },
  grid: {
    display: "flex",
    flexFlow: "column",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      height: "50%",
    },
  },
  mainGrid: {
    height: "200px",
    [theme.breakpoints.down("sm")]: {
      height: "400px",
    },
  },
  error: {
    // color:"00203f",
    color: "red",
    fontSize: "1rem",
    textAlign: "center",
  },
  boxError1: {
    width: "100%",
    textAlign: "center",
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  boxError2: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
});

const PostJob = ({ classes, ...props }) => {
  const history = useHistory();
  const params = useParams();
  const initialJob = {
    id: params.id ?? 0,
    title: "",
    description: "",
    reserved: false,
    paymentType: "",
    minAmount: 0,
    maxAmount: 0,
    valuteId: 0,
    userId: 0,
  };

  const handleTechClick = (listOfChosenTechs, tech) => {
    if (listOfChosenTechs.map((x) => x.id).includes(tech.id)) {
      props.detachTech(tech);
    } else {
      props.attachTech(tech);
    }
  };
  const [job, setJob] = useState(initialJob);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (params.id) {
      props.getJobsTechnologies(params.id);
    } else {
      props.emptyJobsTechnologies();
    }
    props.getAllTechnologies();
  }, []);

  const validate = ({ job, technologies }) => {
    let errorsTemp = [];

    if (!/^((\S+\s)|\S)+$/.test(job.title)) {
      errorsTemp = [...errorsTemp, { title: "Invalid title" }];
    }
    if (!/^((\S+\s)|\S){3,}$/.test(job.title)) {
      errorsTemp = [
        ...errorsTemp,
        { title: "Title have to be at least 3 characters" },
      ];
    }
    if (!/^\S.+$/.test(job.description)) {
      errorsTemp = [...errorsTemp, { description: "Invalid description" }];
    }
    if (!/^\S.{9,}$/.test(job.description)) {
      errorsTemp = [
        ...errorsTemp,
        { description: "Description have to be at least 10 characters" },
      ];
    }

    if (!/^(hourly|fixed)$/.test(job.paymentType)) {
      errorsTemp = [...errorsTemp, { paymentType: "Choose payment type" }];
    }

    let validMinMax = true;
    if (
      !/^[1-9]+[0-9]*$/.test(job.minAmount) ||
      /^([1-9]+[0-9]*)\.[0-9]*$/.test(job.minAmount)
    ) {
      if (!/^[1-9]+[0-9]*$/.test(job.minAmount)) {
        errorsTemp = [
          ...errorsTemp,
          { minAmount: "Invalid number for min. amount" },
        ];
        validMinMax = false;
      }

      if (/^([1-9]+[0-9]*)\.[0-9]*$/.test(job.minAmount)) {
        errorsTemp = [...errorsTemp, { minAmount: "Use whole numbers" }];
        validMinMax = false;
      }
    }
    if (
      !/^[1-9]+[0-9]*$/.test(job.maxAmount) ||
      /^([1-9]+[0-9]*)\.[0-9]*$/.test(job.maxAmount)
    ) {
      if (!/^[1-9]+[0-9]*$/.test(job.maxAmount)) {
        errorsTemp = [
          ...errorsTemp,
          { maxAmount: "Invalid number for max. amount" },
        ];
        validMinMax = false;
      }

      if (/^([1-9]+[0-9]*)\.[0-9]*$/.test(job.maxAmount)) {
        errorsTemp = [...errorsTemp, { maxAmount: "Use whole numbers" }];
        validMinMax = false;
      }
    }
    if (validMinMax) {
      if (job.maxAmount < job.minAmount) {
        errorsTemp = [
          ...errorsTemp,
          { minAmount: "Min. amount is greater than max. amount" },
        ];
        errorsTemp = [
          ...errorsTemp,
          { maxAmount: "Max. amount is less than min. amount" },
        ];
      }
    }

    if (!/^[1-9]+[0-9]*$/.test(job.valuteId)) {
      errorsTemp = [...errorsTemp, { valuteId: "Choose valute" }];
    }

    if (!technologies || !technologies.length) {
      errorsTemp = [
        ...errorsTemp,
        { technologies: "Choose at least one technology" },
      ];
    }

    setErrors(errorsTemp);
    return !errorsTemp.length;
  };

  const submitPostJob = async (e) => {
    e.preventDefault();

    let jobObj = {
      job: { ...job, userId: props.user.id },
      technologies: props.technologiesByJobId.map((x) => x.id),
    };

    if (!validate(jobObj)) {
      toast.error(
        "Please insert valid data to " + (params.id ? "save job" : "add job")
      );
      return;
    }
    if (params.id) {
      let editedJob = await props.editJob(jobObj);
      toast.success("You have successfully changed old job");
      history.push("/jobs/" + editedJob?.id);
    } else {
      let newJob = await props.createJob(jobObj);
      if (newJob && newJob.id) {
        toast.success("You have successfully added new job");
        history.push("/jobs/" + newJob?.id);
      }
    }
  };

  // const [technologies, setTechnologies] = useState([]);
  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value }); //stavlja techs na []
  };
  const [valuteList, setValuteList] = useState([]);

  useEffect(() => {
    (async () => {
      props.getAllValutes().then((res) => {
        setValuteList(res);
      });

      if (params.id) {
        setJob(await props.getSingleJob(params.id));
        props.getJobsTechnologies(params.id);
      }
    })();
  }, []);
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: " calc(100vh - 70px)" }}
    >
      <form onSubmit={submitPostJob}>
        <Paper elevation={2} className={classes.root}>
          <Grid container direction="column">
            <h3 className={classes.formHeader}>
              {params.id ? <>Save job</> : <>Post job</>}
            </h3>
            <TextField
              className={classes.input}
              variant="outlined"
              value={job.title}
              name="title"
              placeholder="Title"
              onChange={handleChange}
              error={errors.filter((x) => x.title).length > 0}
            />
            {errors
              .filter((x) => x.title)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.title}
                </FormHelperText>
              ))}
            <TextField
              className={classes.input}
              variant="outlined"
              multiline={true}
              minRows={6}
              maxRows={10}
              value={job.description}
              name="description"
              placeholder="Enter Description"
              onChange={handleChange}
              error={errors.filter((x) => x.description).length > 0}
            />
            {errors
              .filter((x) => x.description)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.description}
                </FormHelperText>
              ))}
            <FormControl component="fieldset">
              <Grid container>
                <Grid
                  item
                  md={4}
                  container
                  alignItems="center"
                  justifyContent="center"
                >
                  <FormLabel className={classes.formLabel}>
                    Payment type
                  </FormLabel>
                </Grid>

                <Grid item md={8} sm={12}>
                  <RadioGroup
                    className={classes.input}
                    defaultValue="fixed"
                    name="paymentType"
                    value={job.paymentType}
                    style={{
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: errors.filter((x) => x.paymentType).length
                        ? "red"
                        : "#00203f", //"#00203f"
                    }}
                  >
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <FormControlLabel
                        value="fixed"
                        className={classes.radioButton}
                        onChange={handleChange}
                        control={<Radio />}
                        label="Fixed"
                      />
                      <FormControlLabel
                        value="hourly"
                        className={classes.radioButton}
                        onChange={handleChange}
                        control={<Radio />}
                        label="Hourly"
                      />
                    </Grid>
                  </RadioGroup>
                </Grid>
              </Grid>
            </FormControl>

            {errors
              .filter((x) => x.paymentType)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.paymentType}
                </FormHelperText>
              ))}

            <FormControl>
              <Grid container>
                <Grid
                  item
                  md={9}
                  container
                  alignItems="center"
                  justifyContent="center"
                >
                  <FormLabel className={classes.formLabel}>
                    Minimal amount
                  </FormLabel>
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    className={classes.minMaxInput}
                    variant="outlined"
                    type="number"
                    value={job.minAmount}
                    name="minAmount"
                    onChange={handleChange}
                    error={errors.filter((x) => x.minAmount).length > 0}
                  />
                </Grid>
              </Grid>
            </FormControl>

            {errors
              .filter((x) => x.minAmount)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.minAmount}
                </FormHelperText>
              ))}

            <FormControl>
              <Grid container>
                <Grid
                  item
                  md={9}
                  container
                  alignItems="center"
                  justifyContent="center"
                >
                  <FormLabel className={classes.formLabel}>
                    Maximal amount
                  </FormLabel>
                </Grid>
                <Grid item md={3} sm={12}>
                  <TextField
                    className={classes.minMaxInput}
                    variant="outlined"
                    type="number"
                    value={job.maxAmount}
                    name="maxAmount"
                    onChange={handleChange}
                    error={errors.filter((x) => x.maxAmount).length > 0}
                  />
                </Grid>
              </Grid>
            </FormControl>
            {errors
              .filter((x) => x.maxAmount)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.maxAmount}
                </FormHelperText>
              ))}

            <FormControl
              variant="outlined"
              style={{
                marginBottom: 5,
              }}
            >
              <Grid container>
                <Grid
                  item
                  md={4}
                  container
                  alignItems="center"
                  justifyContent="center"
                >
                  <FormLabel className={classes.formLabel}>Valute</FormLabel>
                </Grid>
                <Grid item md={8} sm={12}>
                  <Select
                    error={errors.filter((x) => x.valuteId).length > 0}
                    className={classes.selectValutesRoot}
                    name="valuteId"
                    value={job.valuteId}
                    onChange={handleChange}
                  >
                    <MenuItem className={classes.selectMenuItem} value="0">
                      Select Valute
                    </MenuItem>
                    {valuteList.map((valute) => (
                      <MenuItem
                        className={classes.selectMenuItem}
                        value={valute.id}
                        key={valute.id}
                      >
                        {valute.namePlural} - {valute.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </FormControl>

            {errors
              .filter((x) => x.valuteId)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.valuteId}
                </FormHelperText>
              ))}

            <FormControl>
              <Grid container spacing={1} className={classes.mainGrid}>
                <Grid item md={6} sm={12} className={classes.grid}>
                  <ProfileChosenTechnologies
                    type="job"
                    handleTechClick={handleTechClick}
                    error={errors.filter((x) => x.technologies).length > 0}
                  />
                </Grid>

                <Box className={classes.boxError1}>
                  {errors
                    .filter((x) => x.technologies)
                    .map((e) => (
                      <FormHelperText className={classes.error} style={{}}>
                        {e.technologies}
                      </FormHelperText>
                    ))}
                </Box>

                <Grid container item md={6} sm={12} className={classes.grid}>
                  <ProfileUnchosenTechnologies
                    type="job"
                    handleTechClick={handleTechClick}
                  />
                </Grid>
              </Grid>
            </FormControl>

            <Box className={classes.boxError2}>
              {errors
                .filter((x) => x.technologies)
                .map((e) => (
                  <FormHelperText className={classes.error}>
                    {e.technologies}
                  </FormHelperText>
                ))}
            </Box>

            <Button
              variant="contained"
              className={classes.postEditButton}
              type="submit"
            >
              {params.id ? <>Save job</> : <>Post job</>}
            </Button>
          </Grid>
        </Paper>
      </form>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  singleJob: state.jobsReducer.singleJob,
  technologiesByJobId: state.technologiesReducer.technologiesByJobId,
});

const mapDispatchToProps = {
  createJob: jobActions.create,
  getSingleJob: jobActions.findById,
  // technologiesByJobND: technologyActions.fetchByJobId_NO_DISPATCH,
  editJob: jobActions.edit,

  getJobsTechnologies: technologyActions.fetchByJobId,
  emptyJobsTechnologies: technologyActions.emptyByJob,
  getAllTechnologies: technologyActions.fetchAll,
  getAllValutes: valuteActions.fetchAll,

  attachTech: technologyActions.attachTechToJob,
  detachTech: technologyActions.detachTechFromJob,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PostJob));
