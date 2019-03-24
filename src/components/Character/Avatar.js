import Tooltip from '@material-ui/core/Tooltip';
import React from "react";
import styled from "styled-components";
import avatars from "./../../assets/avatars/index";

const AvatarStyle = styled.div`
  border-radius: 50%;
  overflow: hidden;
  background: #f6f6f6;
  padding: 6px;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  margin-bottom: 10px;

  img {
    max-width: 100%;
    flex-shrink: 0;
  }

  ${props => props.size === `small` && `width: 40px;` }
  ${props => props.size === `small` && `height: 40px;` }

`;




export class Avatar extends React.Component {
  state = {
    open: false
  };

  handleTooltipClose = () => {
    this.setState({ open: false });
  };

  handleTooltipOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { name, id, size } = this.props;
    return (
      <AvatarStyle size={size}>
        <Tooltip disableFocusListener title={name}>
          <img alt={name} src={avatars[id]} />
        </Tooltip>
      </AvatarStyle>
    );
  }
}
