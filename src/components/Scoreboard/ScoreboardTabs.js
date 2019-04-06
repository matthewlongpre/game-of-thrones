import { AppBar, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { PageContainerStyled } from "./Styles";

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
                <Tab label="Survivors" />
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