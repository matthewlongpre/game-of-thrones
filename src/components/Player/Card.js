import styled from "styled-components";

export const CardStyle = styled.div`
  background: #fff;
  padding: 20px 20px 40px;

  @media (min-width: 768px) {
    padding: 40px;
  }

  max-width: 600px;

  ${props => props.fullWidth && `max-width: 1080px`}

  margin: 60px auto;
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.01);
  border: 1px solid #eee;

  h2 {
    margin-top: 0;
  }

`;