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
    const { scoresTable, scoresByEpisode, surviversList, throneList } = this.props;

    return (
      <>
        <div style={{ maxWidth: `100%`, overflow: `hidden` }}>
          <AppBar position="static">
            <PageContainerStyled noPadding style={{ marginLeft: `auto`, marginRight: `auto` }}>
              <Tabs variant="scrollable" value={value} onChange={this.handleChange}>
                <Tab label="Scoreboard" />
                <Tab label="By Episode" />
                <Tab label="Survivers" />
                <Tab label="Throne" />
              </Tabs>
            </PageContainerStyled>
          </AppBar>
        </div>

        {value === 0 && scoresTable}
        {value === 1 && scoresByEpisode}
        {value === 2 && surviversList}
        {value === 3 && throneList}

      </>
    );
  }
}