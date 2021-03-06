import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chart from './Chart';
import IndicatorByDate from './IndicatorByDate';
import IndicatorInfo from './IndicatorInfo';


const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: theme.spacing(60),
  },
}));

export default function MainPage(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [indicator, setIndicator] = React.useState(null)

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          {/* Información del Indicador */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <IndicatorInfo admin={props.admin} setIndicator={setIndicator} />
            </Paper>
          </Grid>
          {/* Chart */}
          {
            indicator &&
            < Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                <Chart indicator={indicator} />
              </Paper>
            </Grid>
          }
          {/* Indicador Por Fecha */}
          {
            indicator &&
            < Grid item xs={12}>
              <Paper className={classes.paper}>
                <IndicatorByDate indicatorId={indicator.idIndicador} periodicity={indicator.periodicidad} />
              </Paper>
            </Grid>
          }
        </Grid>
      </Container >
    </main >
  );
}