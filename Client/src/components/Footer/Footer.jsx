import React from "react";
import "./footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer" style={{ backgroundColor: "black" }}>
      <div className="footer__content container">
        <div className="footer__content__logo">
          <div className="logo">
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              CLI <span style={{ color: "red" }}>MAX</span>
            </Link>
          </div>
        </div>
        <div className="footer__content__menus">
          <div className="footer__content__menu">
            <Link style={{ textDecoration: "none" }} to="/">
              Home
            </Link>
            <Link style={{ textDecoration: "none" }} to="/">
              Contact us
            </Link>

            <Link style={{ textDecoration: "none" }} to="/">
              Term of services
            </Link>
            <Link style={{ textDecoration: "none" }} to="/">
              About us
            </Link>
          </div>
          <div className="footer__content__menu">
            <Link style={{ textDecoration: "none" }} to="/">
              Live
            </Link>
            <Link style={{ textDecoration: "none" }} to="/">
              FAQ
            </Link>
            <Link style={{ textDecoration: "none" }} to="/">
              Premium
            </Link>
            <Link style={{ textDecoration: "none" }} to="/">
              Pravacy policy
            </Link>
          </div>
          <div className="footer__content__menu">
            <Link style={{ textDecoration: "none" }} to="/">
              You must watch
            </Link>
            <Link style={{ textDecoration: "none" }} to="/">
              Recent release
            </Link>
            <Link style={{ textDecoration: "none" }} to="/">
              Top IMDB
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
