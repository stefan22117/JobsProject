import React, { useRef } from "react";
import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import { InsertPhoto, Send } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({
  input: {
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        border: 0,
      },
      height: "100%",
    },
    "& .MuiInputBase-root": {
      color: "#00203f",
    },
    background: "linear-gradient(270deg, transparent, white)",
    borderBottomRightRadius: 5,
    flex: 0.5,
    width: "100%",
  },
});

const InboxForm = ({
  sendMessageHandler,
  text,
  setText,
  seenMessages,
  sendImageHandler,
  classes,
}) => {
  const refImgFile = useRef();
  return (
    <form
      onSubmit={sendMessageHandler}
      className={classes.root}
      autoComplete="false"
    >
      <TextField
        className={classes.input}
        variant="outlined"
        placeholder={"Say something..."}
        name="message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={seenMessages}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                aria-label="toggle message visibility"
                onClick={() => refImgFile.current.click()}
              >
                <InsertPhoto style={{ color: "#00203f" }} />
                <input
                  ref={refImgFile}
                  onChange={sendImageHandler}
                  type="file"
                  style={{ display: "none" }}
                  multiple
                />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" aria-label="toggle message visibility">
                <Send style={{ color: "#adefd1" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};

export default withStyles(styles)(InboxForm);
