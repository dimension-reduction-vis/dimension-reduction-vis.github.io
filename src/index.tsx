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

  const [VISTags, setVISTags] = useState<ITags>({});
  const [MLTags, setMLTags] = useState<ITags>({});

  const [searchKey, setSearchKey] = useState('');
  const [version, setVersion] = useState(defaultVersion);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [paperYear, setPaperYears] = useState<ITags>({});
  const [paperArea, setPaperAreas] = useState<ITags>({});

  const isMenuOpen = Boolean(anchorEl);
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

    const initialVISTag = getInitialTags('vis', true)
    const initialMLTag = getInitialTags('dr', true)
    const initialPaperYear = getInitialTags('year', false)
    const initialPaperArea = getInitialTags('subject_area', false)


    setPaperAreas(initialPaperArea)
    setPaperYears(initialPaperYear)
    setVISTags(initialVISTag);
    setMLTags(initialMLTag);

  };

  useEffect(() => {
    fetchData(defaultVersion);
  }, []);

  const onProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onClickFilter = (tag: string, type: "vis" | "dr") => {
    // if (type === "vis") {
    //   if (tag !== 'all') {
    //     const newVISTag = {
    //       ...VISTags,
    //       [tag]: !VISTags[tag],
    //     }
    //     setVISTags(newVISTag);
    //   } else {
    //     const flag = Object.values(VISTags).every(d => d)
    //     const newVISTag = Object.keys(VISTags).reduce((o, d) => { 
    //       if (!(d in o)) {
    //         o[d] = !flag
    //       }
    //       return o
    //     }, {})
    //     setVISTags(newVISTag);
    //   }
      

    // } else if (type === "dr") {
    //   if (tag != 'all') {
    //     const newMLTags = {
    //       ...MLTags,
    //       [tag]: !MLTags[tag],
    //     }
    //     setMLTags(newMLTags);
    //   } else {
    //     const flag = Object.values(MLTags).every(d => d)
    //     const newMLTags = Object.keys(MLTags).reduce((o, d) => { 
    //       if (!(d in o)) {
    //         o[d] = !flag
    //       }
    //       return o
    //     }, {})
    //     setMLTags(newMLTags);
    //   }
      
    // }
    
  };

  const onSetSearchKey = (searchKey:string)=>{
    setSearchKey(searchKey.toLowerCase())
  }

  const onSetVersion = (version:string)=>{
    setVersion(version)
    fetchData(version)
  }

  
  const papersAfterFilter = papers.filter(
    (p) => p.dr.some((m) => MLTags[m]) && p.vis.some((v) => VISTags[v]) && p.name.toLowerCase().includes(searchKey)
  );

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />

        <TopBar menuId={menuId} onProfileMenuOpen={onProfileMenuOpen} handleDrawerToggle={handleDrawerToggle}/>

        <SideBar
          paperNumber={papersAfterFilter.length}
          VISTags={VISTags}
          MLTags={MLTags}
          version={version}
          onClickFilter={onClickFilter}
          onSetSearchKey={onSetSearchKey}
          onSetVersion = {onSetVersion}
          paperYear = {paperYear}
          paperArea={paperArea}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Papers papers={papersAfterFilter} />
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
