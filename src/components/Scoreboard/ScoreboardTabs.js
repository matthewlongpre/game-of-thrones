import { AppBar, Tab, Tabs, Typography } from "@material-ui/core";
import React from "react";
import { PageContainerStyled } from "./Styles";

const TabContainer = props => {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

export class ScoreboardTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { scoresTable, scoresByEpisode } = this.props;

    return (
      <>
        <AppBar position="static">
          <PageContainerStyled noPadding style={{ marginLeft: `auto`, marginRight: `auto` }}>
            <Tabs variant="scrollable" value={value} onChange={this.handleChange}>
              <Tab label="Scoreboard" />
              <Tab label="By Episode" />
            </Tabs>
          </PageContainerStyled>
        </AppBar>

        {value === 0 && scoresTable}
        {value === 1 && scoresByEpisode}

      </>
    );
  }
}