import styled from "styled-components";

export const PageContainerStyled = styled.div`
  overflow: hidden;
  padding-left: 10px;
  padding-right: 10px;

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