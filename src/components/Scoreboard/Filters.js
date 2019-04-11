import React from "react";
import { Button, Select, MenuItem } from "@material-ui/core";
import { FiltersStyled, CompareFilterStyled } from "./Styles";

export class Filters extends React.Component {

  state = {
    showFilters: false
  }

  handleChange = (e, name) => {
    this.props.handleCompareChange(e, name);
  }

  handleCompareClick = () => {
    this.props.handleCompareClick();
  }

  expandFilters = () => {
    this.props.expandFilters();
  }

  render() {

    const { handleFilterClick, filter, allEntries, compareOne, compareTwo, showFilters } = this.props;

    const buttonProps = {
      selected: {
        variant: `contained`,
        color: `primary`
      },
      default: {
      }
    }

    const buttons = [
      {
        filterValue: `showAll`,
        text: `Show all`
      },
      {
        filterValue: `onlyMe`,
        text: `Show only mine`
      }
    ];

    const displayedButtons = buttons.map(({ filterValue, text }) =>
      <Button
        key={filterValue}
        onClick={() => handleFilterClick(filterValue)} {...buttonProps[`${filter === filterValue ? `selected` : `default`}`]}>
        {text}
      </Button>
    );

    const filteredEntryListTwo = allEntries.filter(item => item.userId !== compareOne);
    const filteredEntryListOne = allEntries.filter(item => item.userId !== compareTwo);

    const compareSelectOne = filteredEntryListOne.map(({ userId, name }) => <MenuItem key={userId} value={userId}>{name}</MenuItem>);
    const compareSelectTwo = filteredEntryListTwo.map(({ userId, name }) => <MenuItem key={userId} value={userId}>{name}</MenuItem>);

    return (
      <FiltersStyled>
        <Button fullWidth onClick={this.expandFilters} className={`filters-heading ${filter !== `showAll` && `active`}`}>
          Filters {filter !== `showAll` && ` ( 1 )`}

          {showFilters && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z" /><path d="M0 0h24v24H0z" fill="none" /></svg>}
          {!showFilters && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /><path d="M0 0h24v24H0z" fill="none" /></svg>}

        </Button>
        {showFilters && <>
          <div className="filter-row">

            {displayedButtons}

            <CompareFilterStyled>
              <span className={`compare ${filter === `compare` && `active`}`}>
                {filter === `compare` ? `Comparing:` : `Compare:`}
              </span>
              <Select
                onChange={e => this.handleChange(e, "compareOne")}
                value={compareOne}
                inputProps={{
                  name: `compareOne`,
                  id: `compareOne`
                }}
                className="select"
              >
                {compareSelectOne}
              </Select>

              <span className="to">to</span>

              <Select
                onChange={e => this.handleChange(e, "compareTwo")}
                value={compareTwo}
                inputProps={{
                  name: `compareTwo`,
                  id: `compareTwo`
                }}
                className="select"
              >
                {compareSelectTwo}
              </Select>
              <Button className="go-button" {...buttonProps[`${(compareOne && compareTwo) ? `selected` : `default`}`]} onClick={this.handleCompareClick}>Go</Button>
            </CompareFilterStyled>
          </div>
        </>}


      </FiltersStyled>
    );
  }
}