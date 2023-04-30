import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "../../utils/axios";
import Contacts from "../../components/CHAT/contacts/Contacts";
import ChatContainer from "../../components/CHAT/chatContainer/ChatContainer";
import Welcome from "../../components/CHAT/Welcome/Welcome";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import './chat.scss'
import { getAdmin } from "../../utils/Constants";
export default function Chat() {
  const host = "https://walk-in-style.site/";
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [unreadMessages, setUnreadMessages] = useState({});

  const theater = useSelector((state) => state.theater);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    async function setUser() {
      setCurrentUser(theater);
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
    async function fetchData() {
      const data = await axios.get(getAdmin,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      setContacts(data.data.admin);
    }
    fetchData();
  }, []);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
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
  height:650px;
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
    background-image: url('https://w0.peakpx.com/wallpaper/946/21/HD-wallpaper-whatsapp-theme-background-green-original-simple-texture-thumbnail.jpg');
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
