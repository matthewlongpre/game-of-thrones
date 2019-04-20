import styled from "styled-components";

export const PageContainerStyled = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 60px;

  @media (min-width: 1200px) {
    max-width: 1080px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 414px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  ${props => props.noPadding && `padding: 0 !important`}
  ${props => props.noMargin && `margin: 0 !important`}

`;

export const PageHeadingRow = styled.div`

  h2 {
    font-size: 1.5rem;
  }

  text-align: center;
  padding: 40px 20px 20px;

  @media (max-width: 767px) {
    padding: 0 20px;
  }

`;

export const EpisodeRowStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
  justify-content: center;
`;

export const EpisodeResultsRow = styled.div`
  h3 {
    text-align: center;
  }

  ul {
    justify-content: center;
  }
`;

export const FiltersStyled = styled.div`

  background: #fff;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.1);
  border: 1px solid #eee;

  .container-lg {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }

  @media (min-width: 768px) {
    .container-lg {
      padding: 0 20px;
    }
  }

  .filter-buttons {
    padding: 0 10px;
  }

  .filter-row {
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
    background: #fff;
    border-radius: 4px;
  
    button {
      margin-right: 5px;
    }
  
    @media (min-width: 1024px) {
      display: flex;
    }
  }

  .filters-heading {
    font-size: 0.66rem;
    padding: 5px 0px;
    justify-content: flex-start;
    text-align: left;
    border-radius: 0 !important;
  }

  .filters-heading-label {
    margin-left: 10px;
  }

  .filters-heading.active {
    font-weight: 800;
  }

  .compare-name {
    color: blue;
  }

`;

export const CompareFilterStyled = styled.div`
  display: flex;
  flex-direction: column;

  .compare {
    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    line-height: 1.75;
    font-weight: 500;
    border-radius: 4px;
    text-transform: uppercase;
  }

  .to {
    margin-top: 15px;
    margin-bottom: 10px;
  }

  button {
    margin-top: 10px;
  }

  .go-button {
    margin: 20px 0 0;
  }

  @media (max-width: 1023px){
    padding: 20px;

    .compare.active {
      font-weight: 800;
    }
  }

  @media (min-width: 1024px) {
    align-items: center;
    flex-direction: row;

    .compare {
      margin: 0 10px;
      padding: 9px;
      &.active {
        color: #fff;
        background-color: #131312;
      }
    }

    .go-button {
      margin: 0 0 0 10px;
    }

    .to {
      margin: 0 10px;
    }

    .select {
      min-width: 200px;
    }
  }
`;

export const Legend = styled.ul`
  list-style: none;
  margin: 0;
  padding: 20px 20px 20px 60px;
  font-size: 0.8em;
`;

export const StickyControls = styled.div`
  position: sticky;
  z-index: 1;
`;

export const EpisodeResultsSelection = styled.div`

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  padding: 5px;
  font-size: 0.75rem;
  background: #f0f0f0;

  span {
    display: inline-block;
    margin: 5px 10px;
  }

  button {
    padding-top: 0;
    padding-bottom: 0;
    font-size: 0.66rem;
  }
`;

export const Rank = styled.div`
  display: flex;
`;

export const RankDifference = styled.div`
  display: flex;
  font-size: 66%;
  align-items: center;

  @media (min-width: 768px) {
    padding: 0 0 0 5px;
  }
  
  font-weight: 800;

  ${({ difference }) => difference === `increase` && `color: #308e30;`}
  ${({ difference }) => difference === `decrease` && `color: #d42a2a;`}

  svg {
    font-size: 1em;
  }

`;