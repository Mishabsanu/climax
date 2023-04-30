import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "../ChatInput/chatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "../../../utils/axios";
import { format } from "timeago.js";
import { addmsg, getmsg } from "../../../utils/Constants";
export default function ChatContainer({ currentChat, socket, currentUser }) {
  const [messages, setmessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    async function getmessage() {
      const response = await axios.post(getmsg, {
        from: currentUser._id,
        to: currentChat._id,
      });

      setmessages(response.data);
    }

    getmessage();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    await axios.post(addmsg, {
      from: currentUser._id,
      to: currentChat._id,
      recipientName: currentChat.username,
      senderName: currentUser.Name,
      message: msg,
    });

    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      recipientName: currentChat.username,
      senderName: currentUser.Name,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setmessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setmessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Container>
        <div className="chat-header">
          <div className="user-details">
            <div className="avatar">
              <img
                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                src="https://www.oberlo.com/media/1603969791-image-1.jpg"
                alt=""
              />
            </div>
            <div className="username">
              <h3>{currentChat.username}</h3>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${
                    message.fromSelf ? "sended" : "recieved"
                  }`}
                >
                  <div className="contentt relative">
                    <p className="m-0">{message.message}</p>
                    <div
                      style={{ fontSize: "10px" }}
                      className="text-[10px] static right-1 bottom-1"
                    >
                      {format(message.send)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <ChatInput handleSendMsg={handleSendMsg} />
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
          margin-top: 30px;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .contentt {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .contentt {
        background-color: white;
        color: black;
      }
    }
    .recieved {
      justify-content: flex-start;
      .contentt {
        background-color: black;
      }
    }
  }
`;
