import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Badge from "@mui/material/Badge";
import axios from "../../../utils/axios";
import { useSelector } from "react-redux";
import { getUnreadMEssageAllTheater, readTrue } from "../../../utils/Constants";


function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [unreadMessages, setUnreadMessages] = useState({});
  const token = useSelector((state) => state.token);

  const admin = useSelector((state) => state.admin);
  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  useEffect(() => {
    async function fetchUnreadMessages() {
      const unreadMessages = {};
      for (const contact of contacts) {
        const response = await axios.get(
          `${getUnreadMEssageAllTheater}/${admin._id}/${contact._id}`);
        unreadMessages[contact._id] = response.data?.[0]?.count ?? 0;
      }
      setUnreadMessages(unreadMessages);
    }
    fetchUnreadMessages();
  }, [contacts]);

  const [trues, setTrue] = useState(false);

  const trueMessage = (id) => {
    axios
      .patch(`${readTrue}/${id}/${admin._id}`,
        {},{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
      })
      .then((respose) => {
        setTrue(respose.data);
      })
      .catch((error) => {});
  };

  return (
    <>
      <Container>
        <div className="brand">
          <h3>snappy</h3>
        </div>
        <div className="contacts">
          {contacts?.map((contact, index) => {
            // const messageCount = getMessagesCount(contact._id);
            return (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => {
                  changeCurrentChat(index, contact);
                  trueMessage(contact._id);
                }}
              >
                <Badge badgeContent={unreadMessages[contact._id]} color="error">
                  <div className="avatar">
                    <img
                      style={{
                        borderRadius: "50%",
                        height: "70px",
                        width: "70px",
                      }}
                      src={contact?.application?.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact?.Name}</h3>
                  </div>
                </Badge>
              </div>
            );
          })}
        </div>
        <div className="current-user">
          <div className="avatar"></div>
          <div className="username">
            <h2>{currentUserName}</h2>
          </div>
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  // background-color: white;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #7451f8;
    }
  }

  .current-user {
    // background-color:#7451F8;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default Contacts;
