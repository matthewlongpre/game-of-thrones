import React from "react";
import styled from "styled-components";

const PointsBadgeLargeStyle = styled.span`
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-weight: 700;
  font-size: 32px;

  padding: 14px 40px;

  @media (min-width: 768px) {
    padding: 30px 40px;
  }

  align-items: center;
  line-height: 1.5;

  .pts {
    font-size: 12px;
    text-transform: uppercase;
  }

  ${props => props.topRight && `
    position: absolute;
    top: 0;
    right: 0;
  `}
  
`;

export const PointsBadgeLarge = props => {
  const { points } = props;
  return (
    <PointsBadgeLargeStyle {...props}>
      {points}
      <span className="pts">{points === 1 ? `pt` : `pts`}</span>
    </PointsBadgeLargeStyle>
  );
}