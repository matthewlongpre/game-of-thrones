import React from "react";
import styled from "styled-components";

const PointsBadgeStyle = styled.span`
  background: #131312;
  color: #fff;
  padding: 2px 10px;
  border-radius: 5px;
  text-transform: uppercase;
  font-size: 0.75em;
  min-width: 60px;
  text-align: center;
  display: inline-block;

  ${props => props.margin === `auto` && `margin: auto;`}
  ${props => props.marginLeft === `0` && `margin-left: 0;`}
  ${props => props.marginRight && `margin-right: 10px;`}
  ${props => props.marginTop && `margin-top: 10px;`}

  ${props => props.size === `small` && `
    min-width: 40px;
    padding: 2px 6px;
    font-size: 0.66em;
  `}

`;

export const PointsBadge = props => {
  const { points } = props;
  return (
    <PointsBadgeStyle {...props}>
      {points} {points === `1` ? `pt` : `pts`}
    </PointsBadgeStyle>
  );
}