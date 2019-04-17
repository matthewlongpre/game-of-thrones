import styled from "styled-components";

export const AdminContainer = styled.div`
  .main {
    display: flex;

    @media (max-width: 767px) {
      flex-direction: column;
    }
    
    select {
      height: 60vh;
    }
  }

  padding: 20px;

`;