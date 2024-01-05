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
} from "@material-ui/core";
import { Search as SearchIcon, LaunchOutlined as LaunchIcon } from "@material-ui/icons";
import Select from '@material-ui/core/Select';
import { getAvatar } from '../index'
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
  VISTags: Record<string, boolean>;
  MLTags: Record<string, boolean>;
  paperYear: Record<string, number>;
  paperArea: Record<string, number>;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onClickFilter: (k: string, type: 'vis' | 'dr') => void;
  onSetSearchKey: (key: string) => void;
  onSetVersion: (version: string) => void;
}

export function SideBar(props: Props) {
  const { paperNumber, VISTags, MLTags, onClickFilter, onSetSearchKey, onSetVersion, paperArea, paperYear, mobileOpen, handleDrawerToggle } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
      VIS process filter: <Button variant="outlined" size="small" onClick={() => onClickFilter("all", 'vis')}> {Object.values(VISTags).every(d => d) ? 'Unselect All' : 'Select All'}</Button>
    </Typography>
    <div className={classes.filters}>
      {Object.entries(VISTags).map(([v, checked]) => (
        <Tooltip key={v} title={VISTagDetails[v]}>
          <Chip
            key={v}
            avatar={
              <Avatar src={`assets/avatars/${v.replace(' ', '_')}_w.png`} />
            }
            label={v}
            clickable
            variant={checked ? "default" : "outlined"}
            color="primary"

            onClick={() => onClickFilter(v, 'vis')}
          />
        </Tooltip>
      ))}
    </div>

    <Divider />

    <Typography variant="subtitle2" className={classes.filterTitle}>
      ML tasks filter: <Button variant="outlined" size="small" onClick={() => onClickFilter("all", 'dr')}> {Object.values(MLTags).every(d => d) ? 'Unselect All' : 'Select All'}</Button>
    </Typography>
    <div className={classes.filters}>
      <div className={classes.filters}>
        {Object.entries(MLTags).map(([m, checked]) => (
          <Chip
            key={m}
            avatar={<Avatar style={{ color: "white" }} ><b>{getAvatar(m)}</b></Avatar>}
            label={`${m[0].toUpperCase()}${m.slice(1)}`}
            clickable
            variant={checked ? "default" : "outlined"}
            color="secondary"
            onClick={() => onClickFilter(m, 'dr')}
          />
        ))}
      </div>
    </div>
    
    
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
