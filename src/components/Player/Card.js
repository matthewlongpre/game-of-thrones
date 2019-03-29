import styled from "styled-components";

export const CardStyle = styled.div`
  position: relative;
  background: #fff;
  padding: 20px 20px 40px;

  @media (min-width: 768px) {
    padding: 40px;
  }

  max-width: 600px;

  ${props => props.fullWidth && `max-width: 100%`}

  margin-top: 20px;
  margin-bottom: 60px;
  margin-left: auto;
  margin-right: auto;
  
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.01);
  border: 1px solid #eee;

  h2 {
    margin-top: 0;
  }

  .character-name {
    margin-top: 10px;
  }

  ${props => props.grid && `
    margin: 10px;
    min-width: calc(50% - 20px);
    width: calc((33em - 100%) * 1000);
    max-width: calc(100% - 20px);
  
  `}

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

export const CharacterStyle = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-bottom: 20px;

  ${props => props.result === `incorrect` ? `opacity: .33` : `opacity: 1;`}

`;

export const BetsStyle = styled.ul`
  list-style: none;
  margin: 0 0 40px;
  padding: 0;

`;

export const BetStyle = styled.li`
  display: flex;
  padding: 10px;

  ${props => props.result === `incorrect` ? `opacity: .33` : `opacity: 1;`}

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