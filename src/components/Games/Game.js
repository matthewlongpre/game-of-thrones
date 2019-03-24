import React from "react";
import { Link } from "@reach/router";
import styled from "styled-components";

const GameNavStyle = styled.ul`
  list-style-type: none;
  margin: 0 0 20px;
  padding: 0;
  display: flex;
  background: #f7f7f7;

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
        <div className="container-lg">
          {this.props.children}
        </div>
      );
    }

    return (
      <div className="container-lg">
        <GameNavStyle>
          <li>
            <NavLink to={`scoreboard`}>Scoreboard</NavLink>
          </li>
          <li>
            <NavLink to={`player/${user.uid}`}>My Entry</NavLink>
          </li>
        </GameNavStyle>
        {this.props.children}
      </div>
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
