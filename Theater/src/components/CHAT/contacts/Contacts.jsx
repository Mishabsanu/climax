import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Badge from "@mui/material/Badge";
import axios from "../../../utils/axios";
import { useSelector } from "react-redux";
import {
  getUnreadMEssageAllTheater,
  readTrueTheater,
} from "../../../utils/Constants";
function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [unreadMessages, setUnreadMessages] = useState({});

  const theater = useSelector((state) => state.theater);
  const sortedContacts = contacts.sort((a, b) => {
    const aLastMessageDate = a.latestMessage
      ? new Date(a.latestMessage.createdAt)
      : new Date(0);
    const bLastMessageDate = b.latestMessage
      ? new Date(b.latestMessage.createdAt)
      : new Date(0);
    return bLastMessageDate - aLastMessageDate;
  });

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.Name);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact, contactId) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  useEffect(() => {
    async function fetchUnreadMessages() {
      const unreadMessages = {};
      for (const contact of contacts) {
        const response = await axios.get(
          `${getUnreadMEssageAllTheater}/${theater._id}/${contact._id}`
        );

        unreadMessages[contact._id] = response.data?.[0]?.count ?? 0;
      }
      setUnreadMessages(unreadMessages);
    }
    fetchUnreadMessages();
  }, [contacts]);

  const [trues, setTrue] = useState(false);

  const trueMessage = (id) => {
    axios
      .patch(`${readTrueTheater}/${id}/${theater._id}`)
      .then((respose) => {
        setTrue(respose.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Container>
        <div className="brand">
          <h3>{currentUser?.application?.theatername}</h3>
        </div>
        <div className="contacts">
          {sortedContacts?.map((contact, index) => {
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
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                      }}
                      src="https://www.oberlo.com/media/1603969791-image-1.jpg"
                      alt=""
                    />
                  </div>
                </Badge>
                <div className="username">
                  <h3>{contact?.username}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className="current-user">
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
