import React, { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { Box, Grid, Paper } from "@material-ui/core";

import mediumZoom from "medium-zoom";

import { connect } from "react-redux";
import axios from "axios";
import * as freelancerActions from "../redux/actions/freelancerActions";
import InboxFreelancer from "./InboxFreelancer";
import InboxForm from "./InboxForm";

const Inbox = (props) => {
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState();
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [text, setText] = useState("");

  const refMessagesField = useRef();

  const buildConnection = () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:44311/hubs/chat") //5001
      .configureLogging(LogLevel.Information) //??logging
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  };

  const startConnection = (userId) => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");
          connection.on(
            "ReceiveMessage",

            (message) => {
              Promise.resolve(
                (async () => {
                  let mess = await axios.get(
                    "chat/getMessages/" +
                      message.senderId +
                      "/" +
                      message.receiverId
                  );
                  setMessages([...mess.data]);
                })()
              );

              props.getUnreadMessages(userId);
            }
          );

          connection.invoke("GetIntoInbox", {
            userId: userId,
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
    console.log("conected", connection);
  };
  useEffect(() => {
    buildConnection();

    return () => {
      props.removeFreelancerForMessage();
    };
  }, []);

  useEffect(() => {
    if (props.freelancerForMessage.id) {
      setSelectedUserId(props.freelancerForMessage.id);
    }
  }, [props.allFreelancersForInbox]);

  useEffect(() => {
    if(props.loggedUser.id){
      props.getAllFreelancersForInbox(props.loggedUser.id);
    }

    if (props.loggedUser.id && connection) {
      startConnection(props.loggedUser.id);
    }
    if (props.loggedUser.id) {
      props.getUnreadMessages(props.loggedUser.id);
    }
  }, [props.loggedUser, connection]);

  useEffect(() => {
    Promise.resolve(
      (async () => {
        if (selectedUserId && props.loggedUser.id) {
          let mess = await axios.get(
            "chat/getMessages/" + selectedUserId + "/" + props.loggedUser.id
          );
          props.getUnreadMessages(props.loggedUser.id);
          setMessages(mess.data);
        }
      })()
    );
  }, [selectedUserId]);

  useEffect(() => {
    scrollDown();

    const zoom = mediumZoom(".imgMessageMediumZoom", { background: "#adefd1" });

    zoom.on("closed", (event) => {
      event.target.style.borderRadius = "10px";
    });

    zoom.on("open", (event) => {
      event.target.style.borderRadius = "0";
    });
  }, [messages]);

  const scrollDown = () => {
    refMessagesField.current.scroll({
      top: 
        refMessagesField.current.scrollHeight -
        refMessagesField.current.clientHeight + 5,
    });
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (!selectedUserId || !props.loggedUser.id || !text) {
      return;
    }
    setText("");
    const chatMessage = {
      senderId: props.loggedUser.id,
      receiverId: selectedUserId,
      type: "text",
      text: text,
    };
    const chatMessageFormData = new FormData();
    Object.keys(chatMessage).forEach((key) => {
      if (!key.includes("images")) {
        chatMessageFormData.append(key, chatMessage[key]);
      }
    });

    try {
      await axios.post("chat/sendMessage", chatMessageFormData);
    } catch (e) {
      console.log("Sending message failed.", e);
    }
  };

  const sendImageHandler = async (e) => {
    const [file] = e.target.files;
    if (file) {
      if (!selectedUserId || !props.loggedUser.id) {
        return;
      }
      setText("");
      const chatMessage = {
        senderId: props.loggedUser.id,
        receiverId: selectedUserId,
        type: "img",
        text: "",
        images: [...e.target.files],
      };

      const chatMessageFormData = new FormData();

      Object.keys(chatMessage).forEach((key) => {
        if (!key.includes("images")) {
          chatMessageFormData.append(key, chatMessage[key]);
        }
      });

      chatMessage.images.forEach((img) => {
        chatMessageFormData.append("images", img);
      });

      try {
        await axios.post("chat/sendMessage", chatMessageFormData);
      } catch (e) {
        console.log("Sending message failed.", e);
      }
    }
  };

  const seenMessages = () => {
    Promise.resolve(
      (async () => {
        await axios.get("chat/seenMessages/" + selectedUserId);
        if (selectedUserId && props.loggedUser.id) {
          let mess = await axios.get(
            "chat/getMessages/" + selectedUserId + "/" + props.loggedUser.id
          );
          props.getUnreadMessages(props.loggedUser.id);

          console.log("not porukeee", mess.data);
          setMessages(mess.data);
        }
      })()
    );
  };

  const NewMessagesLabel = ({ text = "New Messages" }) => (
    <div
      style={{
        textAlign: "center",
        borderBottom: "1px solid red",
        marginBottom: 20,
      }}
    >
      {text}
    </div>
  );

  return (
    
    <Paper elevation={2} style={{
      backgroundColor:'transparent'
    }}>

      <Grid
        container
        style={{
          display: "flex",
        }}
      >
        <Grid
          item
          md={2}
          style={{
            height: 5,
            backgroundColor: "#adefd1",
          }}
        ></Grid>

        <Grid
          item
          md={10}
          style={{
            height: 5,
            background: "linear-gradient(270deg, transparent, white)",
          }}
        ></Grid>

        <Grid container
        style={{
          height:'60vh'
        }}
        >
          <Grid
            item
            md={2}
            style={{
              backgroundColor: "#adefd1",
              direction: "rtl",
              overflowY: "auto",
              height:'100%'
            }}
          >
            {props.freelancerForMessage.id &&
              !props.allFreelancersForInbox
                .map((x) => x.id)
                .includes(props.freelancerForMessage.id) &&
              props.allFreelancersForInbox.push(props.freelancerForMessage) &&
              null}

            {
              props.allFreelancersForInbox
                .filter((u) => u.id != props.loggedUser.id)
                .map((u, i) => (
                  <InboxFreelancer
                    key={i}
                    setSelectedUserId={setSelectedUserId}
                    selectedUserId={selectedUserId}
                    user={u}
                  />
                ))
            }
          </Grid>

          <Grid container item md={10} direction="column"
            style={{
              flexFlow:'column',
                  height:'100%'
            }}
          >
            <Grid
              item
              
              // md={12}
              style={{
                flexGrow:1,
                background: "linear-gradient(270deg, transparent, white)",
                padding: 50,
                scrollPadding: "50px 0 0 50px",
                overflow: "auto",
              }}
              ref={refMessagesField}
            >
              {messages.map((m, i, sve) => (
                <React.Fragment key={i}>

                  {props.loggedUser.id != m?.senderId &&
                    !m.seen &&
                    sve.map((x) => x.seen).indexOf(false) == i && (
                      <NewMessagesLabel text={"New messages"} />
                    )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        props.loggedUser.id == m?.senderId ? "end" : "start",
                    }}
                    key={i}
                  >
                    {
                      <p
                        style={{
                          borderRadius: 10,
                          maxWidth: 300,
                          padding: 5,
                          overflowWrap: "break-word",
                          textAlign:
                            props.loggedUser.id == m?.senderId
                              ? "right"
                              : "left",
                          backgroundColor:
                            props.loggedUser.id == m?.senderId
                              ? "#adefd1"
                              : "#00203f",

                          color:
                            props.loggedUser.id != m?.senderId && !m.seen
                              ? "red"
                              : props.loggedUser.id == m?.senderId
                              ? "#00203f"
                              : "#adefd1",
                        }}
                      >
                        {m.type == "img" ? (
                          <Box
                            component="img"
                            className="imgMessageMediumZoom"
                            onLoad={scrollDown}
                            sx={{
                              width: 290,
                              borderRadius: 10,
                            }}
                            alt="Image has been deleted."
                            src={"/media/messageImages/" + m.text}
                          />
                        ) : (
                          m.text
                        )}
                      </p>
                    }
                  </div>
                </ React.Fragment>
              ))}
            </Grid>
            <Grid item
            >
              <InboxForm
                {...{
                  sendMessageHandler,
                  text,
                  setText,
                  seenMessages,
                  sendImageHandler,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
const mapStateToProps = (state) => ({
  loggedUser: state.usersReducer.user,
  allFreelancersForInbox: state.freelancersReducer.list,
  freelancerForMessage: state.freelancersReducer.freelancerForMessage,
});
const mapDispatchToProps = {
  // getAllFreelancersForInbox: freelancerActions.fetchAll,
  getAllFreelancersForInbox: freelancerActions.fetchForInbox,
  removeFreelancerForMessage: freelancerActions.removeForMessage,

  getUnreadMessages: freelancerActions.getUnreadMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
