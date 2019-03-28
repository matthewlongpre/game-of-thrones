import { AppBar, Tab, Tabs, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { episodes } from "../../shared/constants";

const TabContainer = props => {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

export class SimpleTabs extends React.Component {
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
      <>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            {tabs}
          </Tabs>
        </AppBar>

        {tabContent}

      </>
    );
  }
}