import {
  Paper,
  Grid,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  FormLabel,
  FormHelperText,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Visibility,
  VisibilityOff,
  MailOutline,
  Save,
  Replay,
  VerifiedUser,
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import * as userActions from "../redux/actions/userActions";
import * as techtnologyActions from "../redux/actions/technologyActions";
import * as freelancerActions from "../redux/actions/freelancerActions";
import * as valuteActions from "../redux/actions/valuteActions";
import ProfileChosenTechnologies from "./ProfileChosenTechnologies";
import ProfileUnchosenTechnologies from "./ProfileUnchosenTechnologies";

const styles = (theme) => ({
  root: {
    position: "relative",
    // backgroundColor: "#adefd1",
    background: "linear-gradient(180deg, transparent, #adefd1)",
    padding: 5,
  },
  avatarImageRing: {
    width: 220,
    height: 220,
    borderRadius: "50%",
    // backgroundColor: "#00203f",
    backgroundColor: "#adefd1",
    margin: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    cursor: "pointer",
    borderRadius: "50%",
    margin: 20,
  },
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
  formHeader: {
    textAlign: "center",
    color: "#adefd1",
  },
  adornmentVisibility: {
    color: "#adefd1",
  },
  saveChangesButton: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    margin: 10,
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
    },
  },
  resetButton: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    margin: 10,
    fontSize: "0.8rem",
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
    },
  },
  selectValutesRoot: {
    color: "#00203f",
    background: "linear-gradient(270deg, #00203f, #adefd1)",
    borderRadius: 5,
    width: "100%",
    height: "100%",
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
  formLabel: {
    margin: 5,
    color: "#adefd1",
    "&.Mui-focused": {
      color: "#adefd1",
    },
  },
  labelEmailVerified: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "inline",
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
    color: "red",
    fontSize: "1rem",
    textAlign: "center",
  },
});

const Profile = ({ user, classes, ...props }) => {
  const initialuserInfo = {
    id: user.id ?? 0,
    name: user.name ?? "",
    email: user.email ?? "",
    description: user.description ?? "",
    avatar: user.avatar ?? "",
    valuteId: user.valuteId ?? 0,
    password1: "",
    password2: "",
  };
  const [valuteList, setValuteList] = useState([]);

  useEffect(() => {
    props.getAllValutes()
    .then(res=>{
      setValuteList(res);
    });
  }, []);

  useEffect(() => {
    setNewUserInfo({ ...initialuserInfo, password: props.userPassword });
    if (user && user.id) {
      props.getUsersTechnologies(user.id);
    }
    props.getAllTechnologies();
  }, [user, props.userPassword]);

  const [newUserInfo, setNewUserInfo] = useState(initialuserInfo);
  const [newUserAvatar, setNewUserAvatar] = useState(null);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const refAvatar = useRef();
  const refAvatarInput = useRef();

  const avatarClickHandler = () => {
    refAvatarInput.current.click();
  };
  const avatarChangeHandler = (e) => {
    const [file] = e.target.files;
    if (file) {
      refAvatar.current.src = URL.createObjectURL(file);
      setNewUserAvatar(file);
    }
  };

  const changeInfo = (e) => {
    setNewUserInfo({
      ...newUserInfo,
      [e.target.name]: e.target.value,
    });
  };

  const submitProfileChange = async (e) => {
    e.preventDefault();

    let newUserInfoObj = {
      ...newUserInfo,
      id: user.id,
      newAvatar: newUserAvatar,
      technologies: props.technologiesByUserId.map((x) => x.id),
    };

    let formNewUser = new FormData();

    Object.keys(newUserInfoObj).forEach((key) => {
      if (!key.includes("technologies")) {
        formNewUser.append(key, newUserInfoObj[key]);
      }
    });
    newUserInfoObj.technologies.forEach((tech, i) => {
      formNewUser.append("technologies[" + i + "]", tech);
    });

    if (!validate(newUserInfoObj)) {
      toast.error("Please, insert valid data");
      return;
    }

    await props.updateFreelancer(user.id, formNewUser);

    await props.getLoggedUser();
    // history.push("/profile/")

    toast.success("You have successfully changed your data");
  };

  const [errors, setErrors] = useState([]);
  const validate = (userInfo) => {
    let errorsTemp = [];

    if (userInfo.password1 != "" || userInfo.password2 != "") {
      if (!/^([a-zA-Z0-9]|!|@|#|\$|%|\^|&|\*){3,}$/.test(userInfo.password1)) {
        errorsTemp = [...errorsTemp, { password1: "Invalid password" }];
      }
      if (!/^([a-zA-Z0-9]|!|@|#|\$|%|\^|&|\*){3,}$/.test(userInfo.password2)) {
        errorsTemp = [...errorsTemp, { password2: "Invalid password" }];
      }
      if (userInfo.password1 != userInfo.password2) {
        errorsTemp = [...errorsTemp, { password2: "Passwords don't match" }];
      }
    }

    if (!/^[a-zA-Z0-9]{3,}$/.test(userInfo.name)) {
      errorsTemp = [...errorsTemp, { name: "Invalid username" }];
    }

    if (!/^([a-zA-Z0-9])+@([a-zA-Z])+\.([a-zA-Z]){3,5}$/.test(userInfo.email)) {
      errorsTemp = [...errorsTemp, { email: "Invalid email" }];
    }

    if (!/^[1-9]+[0-9]*$/.test(userInfo.valuteId)) {
      errorsTemp = [...errorsTemp, { valuteId: "Choose valute" }];
    }

    setErrors(errorsTemp);
    return !errorsTemp.length;
  };

  const resetProfile = () => {
    setNewUserInfo(initialuserInfo);
    refAvatar.current.src =
      "/media/freelancerAvatar/" +
      (initialuserInfo.avatar ? initialuserInfo.avatar : "unknown_user.jpg");
    refAvatarInput.current.value = ""; //no update

    //?? postaviti stare tehnologije
    props.getUsersTechnologies(user.id);
  };

  const handleTechClick = (listOfChosenTechs, tech) => {
    if (listOfChosenTechs.map((x) => x.id).includes(tech.id)) {
      props.detachTech(tech);
    } else {
      props.attachTech(tech);
    }
  };

  const verifyEmailReqHandler = async () => {

    toast.promise(
      freelancerActions.emailVerifyRequset(),
      {
        loading: "Wait...",
        success: "Email verification sent",
        error: "Please, try again later",
      },
      {
        success: {
          icon: <MailOutline />,
        },
      }
    );
  };
  return (
    <Paper elevation={2} className={classes.root}>
      <form onSubmit={submitProfileChange} autoComplete='false'>
        <Grid container>
          <Grid item md={12} sm={12} justifyContent="center">
            <h3 className={classes.formHeader}>Profile</h3>
          </Grid>
          <Grid container item md={6} sm={12} justifyContent="center">
            <div className={classes.avatarImageRing}>
              <img
                width="200"
                ref={refAvatar}
                onClick={avatarClickHandler}
                src={
                  "/media/freelancerAvatar/" +
                  (user.avatar ? user.avatar : "unknown_user.jpg")
                }
                alt="FreelancerAvatar"
                className={classes.avatarImage}
              />
            </div>
            <input
              ref={refAvatarInput}
              onChange={avatarChangeHandler}
              type="file"
              style={{ display: "none" }}
            />
          </Grid>

          <Grid container direction="column" item md={6} sm={12}>
            <TextField
              className={classes.input}
              value={newUserInfo.name}
              onChange={changeInfo}
              name="name"
              variant="outlined"
              error={errors.filter((x) => x.name).length}
            />
            {errors
              .filter((x) => x.name)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.name}
                </FormHelperText>
              ))}
            <TextField
              className={classes.input}
              type={showPassword1 ? "text" : "password"}
              value={newUserInfo.password1}
              name="password1"
              onChange={changeInfo}
              variant="outlined"
              placeholder="New Password"
              error={errors.filter((x) => x.password1).length}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      className={classes.adornmentVisibility}
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword1(!showPassword1)}
                    >
                      {showPassword1 ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors
              .filter((x) => x.password1)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.password1}
                </FormHelperText>
              ))}

            <TextField
              className={classes.input}
              type={showPassword2 ? "text" : "password"}
              value={newUserInfo.password2}
              name="password2"
              onChange={changeInfo}
              variant="outlined"
              placeholder="Confirm Password"
              error={errors.filter((x) => x.password2).length}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      className={classes.adornmentVisibility}
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword2(!showPassword2)}
                    >
                      {showPassword2 ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors
              .filter((x) => x.password2)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.password2}
                </FormHelperText>
              ))}
          </Grid>

          <Grid container item md={6} sm={12}>
         

            <Grid container item>
              {user.emailVerified ? (
                <>
                  <Grid item md={8} sm={11}>
                    <TextField
                      className={classes.input}
                      value={newUserInfo.email}
                      onChange={changeInfo}
                      name="email"
                      variant="outlined"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Grid>

                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    item
                    md={4}
                    sm={1}
                  >
                    <span className={classes.formLabel}>
                      <span className={classes.labelEmailVerified}>
                        Email Verified
                      </span>{" "}
                      <VerifiedUser
                        style={{
                          color: "adefd1",
                          padding: 5,
                          fontSize: "2rem",
                          backgroundColor: "#00203f",
                          borderRadius: "50%",
                        }}
                      />
                    </span>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item md={9} sm={10} xs={12}>
                    <TextField
                      className={classes.input}
                      value={newUserInfo.email}
                      onChange={changeInfo}
                      name="email"
                      variant="outlined"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      error={errors.filter((x) => x.email).length}
                    />
                    {errors
                      .filter((x) => x.email)
                      .map((e) => (
                        <FormHelperText className={classes.error}>
                          {e.email}
                        </FormHelperText>
                      ))}
                  </Grid>

                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    item
                    md={3}
                    sm={2}
                    xs={12}
                  >
                    <Button
                      className={classes.saveChangesButton}
                      style={{
                        fontSize: "0.8rem",
                      }}
                      onClick={verifyEmailReqHandler}
                    >
                      Verify Email
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>

          <Grid item container justifyContent="center" md={6} sm={12}>
            <FormControl
              variant="outlined"
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <Grid container item style={{ height: "100%" }}>
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
                    className={classes.selectValutesRoot}
                    value={newUserInfo.valuteId}
                    onChange={changeInfo}
                    error={errors.filter((x) => x.valuteId).length}
                    name="valuteId"
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
                {errors
              .filter((x) => x.valuteId)
              .map((e) => (
                <Grid item md={12}>

                <FormHelperText className={classes.error}>
                  {e.valuteId}
                </FormHelperText>
                </Grid>
              ))}
              </Grid>
            </FormControl>
          </Grid>



          <Grid item md={12} sm={12} xs={12} style={
            {
              marginTop:5
            }
          }> 
          

          <TextField
              className={classes.input}
              style={{
                height:'100%',
                width:'100%',
              }}
              variant="outlined"
              multiline={true}
              minRows={6}
              maxRows={10}
              value={newUserInfo.description}
              name="description"
              placeholder="Enter Description"
              onChange={changeInfo}
              // error={errors.filter((x) => x.description).length > 0} // not required
            />
            {/* {errors
              .filter((x) => x.description)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.description}
                </FormHelperText>
              ))} */}


      
          </Grid>







          <FormControl style={{ marginTop: 5, width: "100%" }}>
            <Grid container spacing={1} className={classes.mainGrid}>
              <Grid item md={6} sm={12} className={classes.grid}>
                <ProfileChosenTechnologies
                  type="user"
                  handleTechClick={handleTechClick}
                />
              </Grid>
              <Grid container item md={6} sm={12} className={classes.grid}>
                <ProfileUnchosenTechnologies
                  type="user"
                  handleTechClick={handleTechClick}
                />
              </Grid>
            </Grid>
          </FormControl>

     

          <Grid container>
            <Grid item md={6}></Grid>
            <Grid
              container
              item
              md={3}
              sm={6}
              justifyContent="flex-end"
              alignItems="center"
            >
              <IconButton
                variant="contained"
                className={classes.resetButton}
                color="secondary"
                onClick={resetProfile}
              >
                <Replay />
              </IconButton>
            </Grid>
            <Grid
              container
              item
              md={3}
              sm={6}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                className={classes.saveChangesButton}
                type="submit"
              >
                Save Changes <Save />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
  technologiesByUserId: state.technologiesReducer.technologiesByUserId,
});
const mapDispatchToProps = {
  getLoggedUser: userActions.getLoggedUser,
  getUsersTechnologies: techtnologyActions.fetchByUserId,
  getAllTechnologies: techtnologyActions.fetchAll,
  getAllValutes: valuteActions.fetchAll,
  attachTech: techtnologyActions.attachTechToUser,
  detachTech: techtnologyActions.detachTechFromUser,

  updateFreelancer: freelancerActions.update,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Profile));
