import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "../../utils/axios";
import Contacts from "../../components/CHAT/contacts/Contacts";
import ChatContainer from "../../components/CHAT/chatContainer/ChatContainer";
import Welcome from "../../components/CHAT/Welcome/Welcome";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { getAllTheater, getmsg, latestMessage } from "../../utils/Constants";

export default function Chat() {
  const host = "https://walk-in-style.site/";
  // const host = "https://walk-in-style.site/";
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const Admin = useSelector((state) => state.admin);
  const token = useSelector((state) => state.token);
  useEffect(() => {
    async function setUser() {
      setCurrentUser(Admin);
    }
    setUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const users = await axios.get(getAllTheater, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const messagePromises = users.data.map(async (user) => {
      const message = await axios.get(`${latestMessage}/${user._id}`);

      return {
        ...user,
        latestMessageCreatedAt: message.data ? message.data.createdAt : null,
      };
    });

    const usersWithLatestMessages = await Promise.all(messagePromises);
    const sortedUsers = usersWithLatestMessages.sort((a, b) => {
      return (
        new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt)
      );
    });

    setContacts(sortedUsers);
  }

  const updateContacts = (newContact) => {
    // Find the index of the contact in the contacts array
    const index = contacts.findIndex(
      (contact) => contact._id === newContact._id
    );

    if (index !== -1) {
      // If the contact already exists in the contacts array, update its data
      setContacts((prevContacts) => [
        newContact,
        ...prevContacts.slice(0, index),
        ...prevContacts.slice(index + 1),
      ]);
    } else {
      // If the contact doesn't exist in the contacts array, add it to the top
      setContacts((prevContacts) => [newContact, ...prevContacts]);
    }

    // Sort the contacts based on the latest message's createdAt time in descending order
    const sortedContacts = contacts.sort((a, b) => {
      return (
        new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt)
      );
    });
    setContacts(sortedContacts);
  };

  async function fetchMessages() {
    if (currentChat) {
      const response = await axios.post(getmsg, {
        from: currentUser._id,
        to: currentChat._id,
      });

      setMessages(response.data);
    }
  }

  const updateMessages = (chatId, newMessages) => {
    const updatedMessages = messages.map((chat) => {
      if (chat._id === chatId) {
        return {
          ...chat,
          messages: newMessages,
        };
      }
      return chat;
    });
    setMessages(updatedMessages);
    updateContacts(chatId, updatedMessages);
  };

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setMessages([]);
    fetchMessages();
  };

  const sendMessage = (messageText) => {
    const message = {
      sender: currentUser._id,
      receiver: currentChat._id,
      text: messageText,
    };
    socket.current.emit("send-message", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="charts">
          <Container>
            <div className="container">
              <Contacts
                contacts={contacts}
                changeChat={handleChatChange}
                currentUser={currentUser}
              />
              {currentChat === undefined ? (
                <Welcome />
              ) : (
                <ChatContainer
                  currentChat={currentChat}
                  socket={socket}
                  currentUser={currentUser}
                  sendMessage={sendMessage}
                  updateMessages={updateMessages}
                  updateContacts={updateContacts}
                />
              )}
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}

const Container = styled.div`
  height: 650px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: white;
  .container {
    height: 90%;
    width: 90%;
    background-image: url("https://w0.peakpx.com/wallpaper/946/21/HD-wallpaper-whatsapp-theme-background-green-original-simple-texture-thumbnail.jpg");
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
