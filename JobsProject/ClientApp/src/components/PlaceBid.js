import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  Grid,
  TextField,
  Slider,
  InputLabel,
  FormLabel,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router";
import { toast } from "react-hot-toast";
import * as bidActions from "../redux/actions/bidActions";
import * as jobActions from "../redux/actions/jobActions";

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
    // width:'100%'
  },
  amountInput: {
    ...stylesHelper.input,
    width: "100%",
    "& .MuiInputBase-root": {
      color: "#adefd1",
      direction: "rtl",
    },
  },
  messageInput: {
    ...stylesHelper.input,
  },
  slider: {
    height: 30,
    width:'100%',
    padding: 0,
    borderRadius: 5,
    border: "1px solid #00203f",
    width: "80%",
    // background: "linear-gradient(270deg, #00203f, #adefd1)",
    backgroundColor: "#adefd1",
    "& .MuiSlider-rail": {
      background: "transparent",
      height: "100%",
    },
    "& .MuiSlider-track": {
      background: "linear-gradient(270deg, #00203f, #adefd1)",
      // backgroundColor: "#00203f",
      borderRadius: 5,
      height: "100%",
    },
    "& .MuiSlider-thumb": {
      height: "100%",
      color: "#00203f",
      display: "none",
      borderRadious: 0,

      // "&::after":{

      // }
    },
  },
  bidButton: {
    backgroundColor: "#00203f",
    color: "#adefd1",
    margin: 10,
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#00203f",
      color: "#adefd1",
    },
  },
});

const PlaceBid = ({ title, classes, ...props }) => {
  // useEffect(() => {
  //   return ()=>{
  //     props.emptySingleBid();
  //   }
  // }, [])
  const history = useHistory();
  const params = useParams();
  
  const initialBid = {
    jobId: params.id,
    userId: props.user.id,
    amount: 0,
    message: "",
  };

  // useEffect(() => {
  //   if(props.singleBid?.id){
  //     setBid(props.singleBid)
  //   }
  // }, [props.singleBid])
  const [bid, setBid] = useState(initialBid);
  
  const sliderChange = (event, newValue) => {
    setBid({ ...bid, amount: newValue });
  };
  const textAmountChange = (e) => {
    let newValue = e.target.value;
    if (parseInt(e.target.value) > props.maxAmount) {
      newValue = props.maxAmount;
    }
    if (parseInt(e.target.value) < props.minAmount) {
      newValue = props.minAmount;
    }
    setBid({ ...bid, amount: parseInt(newValue) });
  };
  const messageChange = (e) => {
    setBid({ ...bid, message: e.target.value });
  };
  const submitBid = async (e) => {
    e.preventDefault();
    if (!initialBid.userId) {
      return history.push("/login");
    }
      if (await props.bidForJob(bid)) {
        setBid(initialBid);
        toast.success("You have successfully bidded for job: " + title);
      } else {
        toast.error("You have already bidded for job: " + title);
      }
      props.bidByJob(initialBid.jobId);
    
  };



  return (
    <form onSubmit={submitBid}
    style={{
      display:'flex',
      justifyContent:'center',
      width:'100%'
    }}
    >
    <Grid
        container
        className={classes.root}
        direction="column"
        justifyContent="center"

        style={{
          width:'50vw'
          
          
        }}
      >
        <Grid container item
        >
          <Grid
            item
            md={9}
            container
            alignItems="center"
            justifyContent="center"
          >
            <FormLabel className={classes.formLabel}>Amount</FormLabel>
          </Grid>
          <Grid item md={3} sm={12}>
            <TextField
              className={classes.amountInput}
              variant="outlined"
              type="number"
              value={bid.amount}
              onChange={textAmountChange}
            />
          </Grid>
        </Grid>
        <Grid item>
          <InputLabel>{props?.valute?.label}</InputLabel>
        </Grid>
        <Grid item>
          <Slider
          style={{
            width:'100%'
          }}
            className={classes.slider}
            min={props.minAmount}
            max={props.maxAmount}
            value={bid.amount}
            onChange={sliderChange}
          ></Slider>
        </Grid>

        <TextField
          className={classes.messageInput}
          variant="outlined"
          multiline={true}
          minRows={6}
          maxRows={10}
          value={bid.message}
          placeholder="Put message here (optional)"
          onChange={messageChange}
        />
        {props.user.loggedIn ? (
          <Button
            className={classes.bidButton}
            variant="contained"
            type="submit"
          >
            Bid
          </Button>
        ) : (
          <Button className={classes.bidButton} variant="contained" disabled>
            Bid (Log in first)
          </Button>
        )}
      </Grid>
    </form>
  );
};

const mapStateToProps = (state) => ({
  user: state.usersReducer.user,
});

const mapDispatchToProps = {
  bidForJob: bidActions.create,
  bidByJob: bidActions.fetchByJobId,
  getSingleJob: jobActions.findById,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PlaceBid));
