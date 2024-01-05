import React from "react";
import {
  Dialog,
  Button,
  DialogActions,
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';

import { makeStyles } from '@material-ui/core/styles';
import { BarChartOutlined as ChartIcon } from "@material-ui/icons";

import ReactECharts from 'echarts-for-react';
import { ITags } from "..";

const useStyles = makeStyles({
    dialogInfo: {
      padding: '20px',
    },
    openButton: {
        margin: '20px',
        backgroundColor: 'black',
        color: 'white'
    },
    flexContainer: {
        display: 'flex',
        flexWrap: 'wrap'
      },
  });
  
type Props = {
    paperYear: ITags;
    paperArea: ITags;
}

export function ChartModal(props: Props) {
    const { paperArea, paperYear} =props

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    const years = Object.keys(paperYear).sort((a,b)=>parseInt(a)-parseInt(b))

    const yearOption = {
        title: {
            text: 'Count by Year',
          },
        xAxis: {
          type: 'category',
          data: years
        },
        yAxis: {
          type: 'value'
        },
        label: {
            show: true,
            position: 'top',
            fontSize:12,
            width: 40,
            height: 40
        },
        series: [
          {
            data: years.map(y=>paperYear[y].count),
            type: 'bar'
          }
        ]
      }

      const areas = Object.keys(paperArea).sort((a,b)=>paperArea[a].count - paperArea[b].count)

      const areaOption = {
        title: {
            text: 'Count by Venue',
          },
        xAxis: {
          type: 'category',
          data: areas,
          axisLabel: {
            interval: 0,
            rotate: -40
            }
        },
        label: {
            show: true,
            position: 'top',
            fontSize:12,
            width: 40,
            height: 40
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: areas.map(a=>paperArea[a].count),
            type: 'bar'
          }
        ]
      }

  
    return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} className={classes.openButton} startIcon={<ChartIcon/>}>
       Open Summary Dialog
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} fullWidth={true} maxWidth='lg'>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>

        <div className={classes.flexContainer}>
        
            <ReactECharts
                option={yearOption}
                style={{height: 300, width: '40%', padding: '10px'}}
                notMerge={true}
                lazyUpdate={true}
            />

     
            <ReactECharts
                option={areaOption}
                style={{height: 300, width: '60%', padding: '10px'}}
                notMerge={true}
                lazyUpdate={true}
            />

          
        </div>
      </Dialog>
    </div> 
    );
  }