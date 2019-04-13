import React from "react";
import styled from "styled-components";

const PointsBadgeLargeStyle = styled.span`
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-weight: 700;
  font-size: 32px;
  min-width: 75px;

  padding: 14px 20px;

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

  .max-points {
    position: relative;
    top: -67px;
    right: -23px;
  }
  
`;

export const PointsBadgeLarge = props => {
  const { points, maxPoints } = props;
  return (
    <PointsBadgeLargeStyle {...props}>
      {points}
      <span className="pts">{points === 1 ? `pt` : `pts`}</span>
      {maxPoints && <span className="max-points">{maxPoints}</span>}
    </PointsBadgeLargeStyle>
  );
}