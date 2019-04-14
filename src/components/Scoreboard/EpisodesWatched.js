import { Dialog, DialogTitle, MenuItem, Select, DialogContent, DialogActions, Button, DialogContentText } from "@material-ui/core";
import React from "react";
import { PointsBadge } from "../Character/PointsBadge";
import { episodesWithLabels } from "./../../shared/constants";


export const EpisodesWatched = ({ handleChange, handleClose, allEpisodeResults, episodesWatched, showSpoilerWarning }) => {


  return (
    <>
      <Dialog maxWidth="xs" fullWidth open={showSpoilerWarning} onClose={handleClose} aria-labelledby="simple-dialog-title">
        <DialogTitle id="simple-dialog-title">Spoiler Warning</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ paddingBottom: `20px` }}>
            What's the latest episode you've seen?
          </DialogContentText>
          <Select style={{ minWidth: `180px` }} fullWidth onChange={e => handleChange(e)} value={episodesWatched}>
            <MenuItem value={0}>Have not watched any</MenuItem>
            {allEpisodeResults && allEpisodeResults.map((episode, index) =>
              <MenuItem key={index} value={index + 1}>
                {episodesWithLabels[index].date && <PointsBadge marginRight hidePts points={episodesWithLabels[index].date}></PointsBadge>}
                {episodesWithLabels[index].label}
              </MenuItem>
            )}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button fullWidth onClick={handleClose} variant="contained" color="primary">Go</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

