import React, { useState } from "react";
import {
  Paper,
  Button,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@material-ui/core";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import * as userActions from "../redux/actions/userActions";
import { withStyles } from "@material-ui/core/styles";
import { Home, Visibility, VisibilityOff } from "@material-ui/icons";

const styles = (theme) => ({
  root: {
    background: "linear-gradient(180deg, transparent, #adefd1)",
    marginBottom: 20,

    display: "flex",
    padding: 5,
    width: "50vw",
  },
  registerButton: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    margin: 10,
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
    },
  },
  loginButton: {
    backgroundColor: "#adefd1",
    color: "#00203f",
    margin: 10,
    fontSize: "0.8rem",
    "&:hover": {
      backgroundColor: "#adefd1",
      color: "#00203f",
    },
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
  error: {
    // color: "#00203f",
    color: "red",
    fontSize: "1rem",
    textAlign: "center",
  },
});

const Register = ({ classes, ...props }) => {
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [errors, setErrors] = useState([]);

  const history = useHistory();

  const validate = (register) => {
    let errorsTemp = [];

    if (!/^([a-zA-Z0-9])+$/.test(register.name)) {
      errorsTemp = [...errorsTemp, { name: "Invalid username" }];
    }

    if (
      !/^([a-zA-Z0-9])+@([a-zA-Z])+\.([a-zA-Z]){3,5}$/.test(
        register.email
      )
    ) {
      errorsTemp = [...errorsTemp, { email: "Invalid email" }];
    }

    if (
      !/^([a-zA-Z0-9]|!|@|#|\$|%|\^|&|\*){3,}$/.test(register.password1)
    ) {
      errorsTemp = [...errorsTemp, { password1: "Invalid password" }];
    }
    if (
      !/^([a-zA-Z0-9]|!|@|#|\$|%|\^|&|\*){3,}$/.test(register.password2)
    ) {
      errorsTemp = [...errorsTemp, { password2: "Invalid password" }];
    }

    if (register.password1 != register.password2) {
      errorsTemp = [...errorsTemp, { password2: "Passwords don't match" }];
    }
    setErrors(errorsTemp);
    return !errorsTemp.length;
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    if (validate(register) && (await props.registerUser(register, true))) {
      //CHECKBOOX LOG ME IN AFTER REG??
      history.push("/");
    } else {
      // alert('novalidate')
    }
  };
  const handleChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: " calc(100vh - 70px)" }}
    >
      <form onSubmit={submitRegister} autoComplete='false'>
        <Paper elevation={2} className={classes.root}>
          <Grid container direction="column">
            <h3 className={classes.formHeader}>Register</h3>
            <TextField
              className={classes.input}
              value={register.name}
              variant="outlined"
              name="name"
              placeholder="Name"
              error={[...errors, ...props.errors].filter((x) => x.name).length}
              onChange={handleChange}
            />
            {[...errors, ...props.errors]
              .filter((x) => x.name)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.name}
                </FormHelperText>
              ))}

            <TextField
              className={classes.input}
              value={register.email}
              variant="outlined"
              name="email"
              placeholder="Email"
              error={[...errors, ...props.errors].filter((x) => x.email).length}
              onChange={handleChange}
            />
            {[...errors, ...props.errors]
              .filter((x) => x.email)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.email}
                </FormHelperText>
              ))}
            <TextField
              className={classes.input}
              value={register.password1}
              variant="outlined"
              type={showPassword1 ? "text" : "password"}
              name="password1"
              placeholder="Enter password"
              error={
                [...errors, ...props.errors].filter((x) => x.password1).length
              }
              onChange={handleChange}
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
            {[...errors, ...props.errors]
              .filter((x) => x.password1)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.password1}
                </FormHelperText>
              ))}
            <TextField
              className={classes.input}
              value={register.password2}
              variant="outlined"
              type={showPassword2 ? "text" : "password"}
              name="password2"
              placeholder="Repeat password"
              error={
                [...errors, ...props.errors].filter((x) => x.password2).length
              }
              onChange={handleChange}
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
            {[...errors, ...props.errors]
              .filter((x) => x.password2)
              .map((e) => (
                <FormHelperText className={classes.error}>
                  {e.password2}
                </FormHelperText>
              ))}

            <Grid item style={{ display: "flex" }}>
              <IconButton onClick={() => history.push("/")}>
                <Home
                  style={{
                    color: "#00203f",
                  }}
                />
              </IconButton>

              <Button
                className={classes.loginButton}
                onClick={() => history.push("/login")}
                variant="contained"
                type="button"
                style={{ flex: "0.2" }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                className={classes.registerButton}
                type="submit"
                style={{ flex: "0.8" }}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  // ...state.usersReducer,//??
  errors: state.usersReducer.errors,
});

const mapDispatchToProps = {
  loginUser: userActions.login,
  registerUser: userActions.register,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Register));
