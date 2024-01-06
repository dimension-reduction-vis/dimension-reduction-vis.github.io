import React from "react";
import {
  Grid,
  Paper,
  Card,
  Button,
  CardActions,
  CardMedia,
  Avatar,
  Chip,
  CardContent,
  Typography,
} from "@material-ui/core";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { Paper as TPaper} from "../index";
import { useStyles } from "./style";
import { TAG_PROPERTIES } from "../index";

interface Props {
  papers: TPaper[];
}

export function Papers(props: Props) {
  const { papers } = props;
  const classes = useStyles();
  const onClickPaper = (paper: TPaper)=>{
    window.open(
      paper.url||`https://www.google.com/search?q=${paper.name.replace(' ', '+')}`, 
      "_blank")
  }



  const getPaperTags = (paper: TPaper) => {
    let tags: React.ReactElement[] = [];
    const tagNames = ['vis', 'dr', 'annotation', 'interpretation'];
    tagNames.forEach((tag) => {
      if (paper[tag] && paper[tag].length > 0) {
        paper[tag].forEach((t:string) => {
          tags.push(<Chip key={t} style={{backgroundColor: TAG_PROPERTIES[tag]['color'], color: 'white'}} label={t} />);
        });
      }
    });
    return tags;
  }

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={2}>
          {papers.map((paper, i) => (
            <Grid key={i} item>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent} onClick={()=> onClickPaper(paper)}>
                  {/* <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {paper.venue} {paper.year}
                  </Typography> */}
                  <Typography
                    variant="subtitle1"
                    component="p"
                    className={classes.title}
                  >
                    {paper.name}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {paper.venue} {paper.year}
                  </Typography>
                  <CardMedia
                    className={classes.media}
                    image={`assets/images/${paper.ref}.png`}
                    title={paper.ref}
                  />
                  
                  {/* <Typography variant="body2" component="p">
                    Author1, Author2, Author3, and Author4
                  </Typography> */}
                  <div className={classes.grow}></div>

                  <div className={classes.tags}>

                    {getPaperTags(paper)}

                  </div>
                </CardContent>
                {/* <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions> */}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
