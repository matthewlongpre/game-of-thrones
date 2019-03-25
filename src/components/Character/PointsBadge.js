import React from "react";
import styled from "styled-components";

const PointsBadgeStyle = styled.span`
  background: #e1f4ff;
  padding: 2px 10px;
  border-radius: 5px;
  text-transform: uppercase;
  font-size: 0.75em;
  min-width: 60px;
  text-align: center;
  display: inline-block;
  ${props => props.marginRight && `margin: auto 10px auto 0;`}
  ${props => props.marginTop && `margin: 10px auto auto 0`}
`;

export const PointsBadge = props => {
  const { points } = props;
  return (
    <PointsBadgeStyle {...props}>
      {points} {points === `1` ? `pt` : `pts`}
    </PointsBadgeStyle>
  );
}