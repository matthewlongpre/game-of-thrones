import styled from "styled-components";

export const PageContainerStyled = styled.div`
  overflow: hidden;
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
  text-align: center;
  padding: 40px 20px 20px;
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

  margin-bottom: 10px;

  .filter-row {
    max-width: 1080px;
    margin: 0 auto 20px;
    background: #ededed;
    border-radius: 4px;
  
    button {
      margin-right: 5px;
    }
  
    @media (min-width: 1024px) {
      display: flex;
    }
  }

  .filters-heading {
    justify-content: flex-start;
  }

  .filters-heading.active {
    font-weight: 800;
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
