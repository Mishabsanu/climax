
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../../../assets/robot.gif";
import { useSelector } from "react-redux";
export default function Welcome() {
    const Admin = useSelector((state) => state.admin);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{Admin?.username}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
