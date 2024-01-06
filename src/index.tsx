import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import {
  Typography,
  CssBaseline,
  Paper,
  ThemeProvider,
} from "@material-ui/core";

import { TopBar } from "./TopBar";
import { Papers } from "./Papers";
import { SideBar } from "./SideBar";

import { useStyles, theme } from "./style";

export interface Paper {
  name: string;
  venue: string;
  year: number;
  vis: string[];
  dr: string[];
  subject_area: string;
  ref:string;
  url?: string;
}

export const TAG_PROPERTIES = {
  'vis':{
    color: '#ab47bc',
    isArray: true
  }, 
  'dr':{
    color: '#29b6f6',
    isArray: true
  }, 
  'annotation': {
    color: '#66bb6a',
    isArray: true
  }, 
  'style': {
    color: '#ce93d8',
    isArray: true
  }, 
  'interpretation': {
    color: '#e57373',
    isArray: true
  }, 
  'subject_area':{
    color: 'orange',
    isArray: false
  }, 
  'year': {
    color: 'orange',
    isArray: false
  }, 
} // tag names and whether they are arrays

export interface ITags {
  [category:string]: {
    selected: boolean;
    count: number;
  }
}

// export const getAvatar = (s: string) => {
//   const pieces = s.split(" ");
//   if (pieces.length > 1) {
//     return `${pieces[0][0].toUpperCase()}${pieces[1][0].toUpperCase()}`;
//   } else if(s === 'Clustering') {
//       return 'CLT'
//   } else if(s === 'Classification') {
//       return 'CLS'
//   } else if (s === 'Regression') {
//       return 'RE'
//   } else if (s === 'Reinforcement') {
//       return 'RF'
//   }
//   return `${pieces[0][0].toUpperCase()}`;
// };

export default function App() {
  const classes = useStyles();
  const defaultVersion = "survey"

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [papers, setPapers] = useState<Paper[]>([]);

  const [tags, setTags] = useState<{[tagName:string]:ITags}>({});

  const [searchKey, setSearchKey] = useState('');
  const [version, setVersion] = useState(defaultVersion);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuId = "primary-search-account-menu";


  const fetchData = async (version) => {
    const papers = await fetch(`/assets/${version}.json`).then((res) =>
      res.json()
    );
    setPapers(papers);

    const getInitialTags = (tagName:string, arrayFlag: boolean):ITags =>{
      
      if (arrayFlag) {  
        // if the tag is an array for each paper
        return papers.reduce((o, d) => {
          d[tagName].forEach((v) => {
            if (!(v in o)) {
              o[v] = {
                count: 1,
                selected: true
              }
            } else {
              o[v].count += 1
            }
          });
          return o;
        }, {})
    } else {
      // if the tag is a single value for each paper
      return papers.reduce((o, d) => {
        if (! (d[tagName] in o)){
          o[d[tagName]] = {
            selected: true,
            count: 1
          }
        } else {
          o[d[tagName]].count +=1
        }
        return o
      }, {})
    }
    }

    const initialTags = {}
   

    Object.keys( TAG_PROPERTIES ).forEach((tagName)=>{
      initialTags[tagName] = getInitialTags(tagName, TAG_PROPERTIES[tagName].isArray)
    })
    setTags(initialTags)

  };

  useEffect(() => {
    fetchData(defaultVersion);
  }, []);

  const onProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClickFilter = (tag: string, category: string) => {
    let newTags = tags
    if (category === 'all') {
      Object.keys(tags[tag]).forEach((category)=>{
        newTags[tag][category].selected = true
      })
    } else {
      newTags = {
        ...tags,
        [tag]: {
          ...tags[tag],
          [category]: {
            ...tags[tag][category],
            selected: !tags[tag][category].selected,
          },
        },
      };
    }
    setTags(newTags);
    
  };

  const onSetSearchKey = (searchKey:string)=>{
    setSearchKey(searchKey.toLowerCase())
  }

  const onSetVersion = (version:string)=>{
    setVersion(version)
    fetchData(version)
  }

  if (!tags['vis']) return null; // return null if the tags are not loaded

  
  const papersAfterFilter = papers.filter(
    (p) => p.dr.some((m) => tags['dr'][m].selected) // include the papers with the selected dr tags
      && p.vis.some((v) => tags['vis'][v].selected) // include the papers with the selected vis tags
      && p.name.toLowerCase().includes(searchKey) // include the papers with the search key
  );

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />

        <TopBar menuId={menuId} onProfileMenuOpen={onProfileMenuOpen} handleDrawerToggle={handleDrawerToggle}/>

        <SideBar
          paperNumber={papersAfterFilter.length}
          tags={tags}
          version={version}
          onClickFilter={onClickFilter}
          onSetSearchKey={onSetSearchKey}
          onSetVersion = {onSetVersion}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Papers papers={papersAfterFilter} />
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
