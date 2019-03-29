import { Link } from "@reach/router";
import React from "react";
import styled from "styled-components";

const GameNavBackgroundStyle = styled.div`
  background: #fff;
  margin-bottom: 60px;
`;

const GameNavStyle = styled.ul`
  list-style-type: none;
  margin: 0 auto;
  padding: 0;
  display: flex;

  li a {
    display: block;
    padding: 20px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 80%;
    color: #4f75aa;
    border-bottom: 4px solid transparent;
  }

  li a.active {
    font-weight: bold;
    background: #4f75aa;
    color: #fff;
    border-bottom: 4px solid #5e8fd7;
  }

`;

export class Game extends React.Component {

  render() {
    const { user, location } = this.props;

    if (location.pathname.includes("/submission")) {
      return (
        <div>
          {this.props.children}
        </div>
      );
    }

    return (
      <>{this.props.children}</>
    );
  }
}

const NavLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      return {
        className: isCurrent ? "active" : ""
      };
    }}
  />
);
