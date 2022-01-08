import React, { useState } from "react";
import {
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import * as userActions from "../redux/actions/userActions";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Home, Visibility, VisibilityOff } from "@material-ui/icons";

const styles = (theme) => ({
  root: {
    background: "linear-gradient(180deg, transparent, #adefd1)",
    marginBottom: 20,

    display: "flex",
    padding: 5,
    width:'50vw'
  },
  loginButton: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    margin: 10,
    fontSize:'1rem',
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
    },
  },
  registerButton: {
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
    marginBottom:5
  },
  formHeader: {
    textAlign:'center',
    color:'#adefd1'
  },
  adornmentVisibility:{
    color:'#adefd1'
  },
  error:{
    // color:"00203f",
    color: "red",
    fontSize:'1rem',
    textAlign:'center'
  }
});

const Login = ({ classes, ...props }) => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const history = useHistory();
  const [errors, setErrors] = useState([]);

  const validate = (register) => {
    let errorsTemp = [];


    if(!/^([a-zA-Z0-9])+@([a-zA-Z])+\.([a-zA-Z]){3,5}$/.test(register.email)){
      errorsTemp = [...errorsTemp, {email:"Invalid email"}]
    }


    if(!/^([a-zA-Z0-9]|!|@|#|\$|%|\^|&|\*){3,}$/.test(register.password)){
      errorsTemp = [...errorsTemp, {password:"Invalid password"}]
    }

    setErrors(errorsTemp)
    return !errorsTemp.length;

  }


  const submitLogin = async (e) => {
    e.preventDefault();
    if (validate(login) && await props.loginUser(login)) {
      history.push("/");
    } else {
      // alert("wrong credentials");
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
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
      <form onSubmit={submitLogin} autoComplete='false'>
        <Paper elevation={2} className={classes.root}>
          <Grid container direction="column">
            <h3 className={classes.formHeader}>Login</h3>
            <TextField
              className={classes.input}
              value={login.email}
              variant="outlined"
              name="email"
              placeholder="Email"
              error={[...errors, ...props.errors].filter(x=>x.email).length}
              onChange={handleChange}
            />
            {[...errors, ...props.errors].filter(x=>x.email).map((e) => (
              <FormHelperText className={classes.error}>{e.email}</FormHelperText>
            ))}

            <TextField
              className={classes.input}
              placeholder="Password"
              error={[...errors, ...props.errors].filter(x=>x.password).length}
              variant="outlined"
              id="standard-adornment-password"
              type={showPassword ? "text" : "password"}
              value={login.password}
              name="password"
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                    className={classes.adornmentVisibility}
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {[...errors, ...props.errors].filter(x=>x.password).map((e) => (
              <FormHelperText className={classes.error}>{e.password}</FormHelperText>
            ))}

              <Grid item 
              style={{display:'flex'}}
              >
                <IconButton
                onClick={()=>history.push('/')}
                >
                  <Home 
                  style={{
                    color:'#00203f'
                  }}
                  />
                </IconButton>


            <Button
              className={classes.registerButton}
              onClick={()=>history.push('/register')}
              variant="contained"
              type="button"
              style={{flex:'0.2'}}
              >
              Register
            </Button>
            <Button
              className={classes.loginButton}
              variant="contained"
              type="submit"
              style={{flex:'0.8'}}
              >
              Login
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
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Login));
