import { AppBar, Tab, Tabs, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { episodes } from "../../shared/constants";
import { PageContainerStyled, StickyControls } from "./Styles";

const TabContainer = props => {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

export class EpisodeTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { episodeCards } = this.props;

    const tabs = episodes.map(episode => <Tab key={episode} label={`Episode ${episode}`} />);

    const tabContent = episodes.map(episode => <Fragment key={episode}>{value === episode - 1 && <TabContainer>{episodeCards[episode - 1]}</TabContainer>}</Fragment>)

    return (
      <div>
        <StickyControls style={{ top: `48px` }}>
          <AppBar position="static">
            <PageContainerStyled noPadding>
              <Tabs variant="scrollable" value={value} onChange={this.handleChange}>
                {tabs}
              </Tabs>
            </PageContainerStyled>
          </AppBar>
        </StickyControls>

        {tabContent}

      </div>
    );
  }
}