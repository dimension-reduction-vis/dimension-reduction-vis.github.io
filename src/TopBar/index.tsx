import React from "react";
import {
  Typography,
  Toolbar,
  IconButton,
  AppBar,
  Badge,
  InputBase,
} from "@material-ui/core";
import {
  // AccountCircle,
  // Notifications as NotificationsIcon,
  // Mail as MailIcon,
  Menu as MenuIcon,
  // Search as SearchIcon,
  CloudUpload,
  Description,
  GitHub
} from "@material-ui/icons";

import { useStyles } from "./style";

interface Props {
  menuId: string;
  handleDrawerToggle: () => void;
  handleModalToggle: () => void;
  onProfileMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
}

export function TopBar(props: Props) {
  const classes = useStyles();
  const { menuId, onProfileMenuOpen, handleDrawerToggle, handleModalToggle } = props;

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap className={classes.title}>
          Paper Browser: A Critical Analysis of the Usage of Dimensionality Reduction in Four Domains by Cashman et al.
        </Typography>

        <div className={classes.sectionDesktop}>

          <a 
            href="assets/pdfs/A_Critical_Analysis_of_the_Usage_of_Dimensionality_Reduction_in_Four_Domains_preprint-web-version.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
          >
            <IconButton
              edge="end"
              aria-label="download paper and supplemental material"
              aria-haspopup="true"
              color="inherit"
            >
              <Description /> <span style={{fontSize: '12px'}} className={classes.iconName}>{' '}Paper + Supp. Material </span>
            </IconButton>
          </a>

          <IconButton
            edge="end"
            aria-label="link to github homepage"
            aria-haspopup="true"
            onClick={()=>window.open("https://github.com/dimension-reduction-vis/dimension-reduction-vis.github.io")}
            color="inherit"
          >
            <GitHub /> <span style={{fontSize: '12px'}} className={classes.iconName}>{' '}Github </span>
          </IconButton>
          {/* <IconButton
            edge="end"
            aria-label="suggest new ML4VIS papers for this survey"
            aria-haspopup="true"
            onClick={()=>window.open("https://github.com/ML4VIS/ML4VIS.github.io/issues/new?assignees=&labels=enhancement&template=suggest-new-ml4vis-papers.md&title=Suggest+Paper%3A+%5Bpaper+title%5D")}
            color="inherit"
          >
            <CloudUpload />  <span style={{fontSize: '12px'}} className={classes.iconName}> {' '}Contribute </span>
          </IconButton> */}
        </div>
      </Toolbar>
    </AppBar>
  );
}
