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

  .character-name {
    margin-top: 10px;
  }

`;

export const AirDate = styled.span`
  text-transform: uppercase;
  font-size: 50%;
  letter-spacing: 1.5px;
  background: #eee;
  padding: 4px 8px;
  border-radius: 4px;
  position: relative;
  top: -4px;
  margin-left: 10px;
`;

export const CharactersStyle = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
`;

export const BetsStyle = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const BetStyle = styled.li`
  display: flex;
  padding: 10px;
`;

export const ListLabel = styled.h3`
  text-transform: uppercase;
  font-size: 66%;
  letter-spacing: 2px;
  margin-bottom: 20px;
`;

export const NoPredictions = styled.p`
  margin: 0 0 40px;
  padding: 10px;
  background: #eee;
  border-radius: 5px;
`;