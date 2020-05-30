import React from 'react';
import { makeStyles, TableRow } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Title from '../../Shared/Title';
import Request from './Request';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AccessRequests() {
  React.useEffect(
    () => {
      let status;
      fetch(`/requests/by/${localStorage.getItem("HUNUserId")}`, {
        method: 'GET',
        headers: {
          'x-access-token': localStorage.getItem("HUNToken")
        },
      }).then((response) =>{status = response.status; return response.json();} )
        .then((responseJson) => {
          setLoading(false)
          if (responseJson.success) {
            setRequests(responseJson.solicitudes);
          } else if(status === 403){
            localStorage.removeItem("HUNToken");
            window.location.reload(); 
          }
        })
    }, []
  );
  const [loading, setLoading] = React.useState(false);
  const [requests, setRequests] = React.useState([]);
  const classes = useStyles();
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <React.Fragment>
          <Paper>
            <Title>Información de solicitudes realizadas</Title>
            <Table size="small">
              <TableBody>
                {requests.map((row, i) => (
                  <TableRow key={row.idSolicitud}>
                    <TableCell>
                      <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                      >
                        <TreeItem nodeId={`${row.idSolicitud}`} label={`Solicitud ${i+1}`} children={<Request label={`Solicitud ${i+1}`} request={row} />} />
                      </TreeView>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </React.Fragment>
      </Container>
    </main>
  );
}