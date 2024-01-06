import React, { useState } from "react";

import {
  Drawer,
  Divider,
  Toolbar,
  Chip,
  Typography,
  InputBase,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  Hidden,
  Tab,
} from "@material-ui/core";
import { Search as SearchIcon, LaunchOutlined as LaunchIcon } from "@material-ui/icons";
import Select from '@material-ui/core/Select';
import { ITags, TAG_PROPERTIES } from '../index'
import { useStyles } from "./style";

import { ChartModal} from '../ChartModal'

const VISTagDetails = {
  "Data Processing4VIS": "raw data is transformed into a format that better suits the following visualization processes.",
  "Data-VIS Mapping": "the values of data fields are mapped into the visual channels of graphic marks.",
  "Insight Communication": "insights are transformed into visualizations that can effectively communicate them.",
  "Style Imitation": "the styles of given visualizations examples are applied to create new visualizations. ",
  "VIS Reading": "users observe the appearance of a visualization, read the encoded data, and understand the underlying information. ML techniques try to automatically 'read' the visualizations like humans",
  "User Profiling": "user actions with visualizations are logged and then analyzed in order to better understand users.",
  "VIS Interaction": "users interact with the visualization and change its appearance.",
}

interface Props {
  paperNumber: number;
  version: string;
  // VISTags: ITags;
  // MLTags: ITags;
  // paperYear: ITags;
  // paperArea: ITags;
  tags: {[tagName:string]:ITags};
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onClickFilter: (tag: string, category:string) => void;
  onSetSearchKey: (key: string) => void;
  onSetVersion: (version: string) => void;
}

export function SideBar(props: Props) {
  const { paperNumber,  onClickFilter, onSetSearchKey, tags, mobileOpen, handleDrawerToggle } = props;
  if (!tags['vis']) return null;
  const { year: paperYear, subject_area: paperArea } = tags;
  
  const classes = useStyles();

  const getTagFilter = (tag:string)=>(
    <div className={classes.filters}>
        {Object.keys(tags[tag]).map((cate) => (
          <Chip
            key={cate}
            // avatar={<Avatar style={{ color: "white" }} ><b>{getAvatar(m)}</b></Avatar>}
            // label={`${m[0].toUpperCase()}${m.slice(1)}`}
            label={`${cate.toUpperCase()} (${tags[tag][cate].count})`}
            clickable
            // color='primary'
            style={{
              backgroundColor: tags[tag][cate].selected ? TAG_PROPERTIES[tag].color: 'white', 
              color: tags[tag][cate].selected ? 'white': TAG_PROPERTIES[tag].color, margin: '2px'
            }}
            variant={tags[tag][cate].selected ? "default" : "outlined"
            }
            onClick={() => onClickFilter(tag, cate)}
          />
        ))}
    </div>
  )

  const drawer = <div className={classes.drawerContainer}>
    <Toolbar />

    <Typography variant="h5" className={classes.paperNumber}>
      Papers: {paperNumber}
    </Typography>

    <Divider />

    <Typography variant="subtitle2" className={classes.filterTitle}>
      Keywords search:
    </Typography>
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
        onChange={(event) => onSetSearchKey(event.target.value)}
      />
    </div>

    <Divider />
    < ChartModal
      paperYear={paperYear}
      paperArea={paperArea}
    />
    <Divider />

    <Typography variant="subtitle2" className={classes.filterTitle}>
      Visualization Types: 
      {/* <Button variant="outlined" size="small" onClick={() => onClickFilter('vis', "all")}> {Object.values(VISTags).every(d => d.selected) ? 'Unselect All' : 'Select All'}</Button> */}
    </Typography>
    {getTagFilter('vis')}

    <Divider />

    <Typography variant="subtitle2" className={classes.filterTitle}>
      Dimension Reduction Methods: 
      {/* <Button variant="outlined" size="small" onClick={() => onClickFilter('dr', 'all')}> {Object.values(MLTags).every(d => d.selected) ? 'Unselect All' : 'Select All'}</Button> */}
    </Typography>
    {getTagFilter('dr')}

    <Divider />
    <Typography variant="subtitle2" className={classes.filterTitle}>
      Annotation: 
      {/* <Button variant="outlined" size="small" onClick={() => onClickFilter('dr', 'all')}> {Object.values(MLTags).every(d => d.selected) ? 'Unselect All' : 'Select All'}</Button> */}
    </Typography>
    {getTagFilter('annotation')}

    <Divider />
    <Typography variant="subtitle2" className={classes.filterTitle}>
      Interpretaion: 
      {/* <Button variant="outlined" size="small" onClick={() => onClickFilter('dr', 'all')}> {Object.values(MLTags).every(d => d.selected) ? 'Unselect All' : 'Select All'}</Button> */}
    </Typography>
    {getTagFilter('interpretation')}
    
    
  </div>

  return (<>
      <Hidden smUp implementation="css">
        {/* this drawer is for the mobile mode */}
        <Drawer
          variant="temporary"
          anchor={'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </>
  );
}
