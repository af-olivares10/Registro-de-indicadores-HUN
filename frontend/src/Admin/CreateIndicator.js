import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../Shared/Title';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
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

const validateData = (data) => {
  for(let key in data) {
    if(key === "startCurrentPeriod" && new Date(data[key]).getTime() < new Date().getTime()) return key
    else if(!data[key]) return key;
  }
  return "";
}

const camelToText = function (camel) {
  let text = camel.replace(/([A-Z])/g, "$1");
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const getMonth = (idPeriod, periods) => {
  for(let i = 0; i < periods.length; i++) {
    if(periods[i].idPeriodo === parseInt(idPeriod)) return periods[i].meses;
  }
  return 0;
}


export default function CreateIndicador() {
  React.useEffect(
    () => {
      let status;
      fetch("/units/", {
        method: 'GET',
        headers: {
          'x-access-token': localStorage.getItem("HUNToken")
        },
      }).then((response) =>{status = response.status; return response.json();} )
        .then((responseJson) => {
          setLoading(false)
          if (responseJson.success) {
            setUnits(responseJson.unidades)
          } else if(status === 403){
            localStorage.removeItem("HUNToken");
            window.location.reload(); 
          }
        });
      fetch("/indicators/periods/all", {
        method: "GET",
        headers: {
          'x-access-token': localStorage.getItem("HUNToken")
        },
        }).then((response) => {status = response.status; return response.json()})
        .then((responseJson) => {
          setLoading(false);
          if (responseJson.success) {
            setPeriods(responseJson.periodos);
          } else if (status === 403) {
            localStorage.removeItem("HUNToken");
            window.location.reload();
          }
        });
    }, []
  );

  const [loading, setLoading] = React.useState(false);
  const [units, setUnits] = React.useState([]);
  const [periods, setPeriods] = React.useState([]);
  const [state, setState] = React.useState({
    name: "",
    definition: "",
    idPeriod: "",
    idUnit: "",
    dataSource: "",
    formula: "",
    unitMeasurement: "",
    responsableData: "",
    responsableIndicator: "",
    goal: "",
    startCurrentPeriod: "",
    endCurrentPeriod: "",
  });

  const handleDateChange = (event) => {
    const month = getMonth(state.idPeriod, periods);
    if(month) {
      state.startCurrentPeriod = moment(event.target.value).toString();
      state.endCurrentPeriod = moment(event.target.value).add(month, "M").toString();
      setState(state);
    } else {
      alert("Snack de error");
    }
  }
 
  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleClick = () => {
    let status;
    if(validateData(state)) {
      alert("Cambiar esto por un snack");
    } else {
      fetch("/indicators/", {
        method: "POST",
        body: JSON.stringify(state),
        headers: {
          'x-access-token': localStorage.getItem("HUNToken"),
          'Content-Type': 'application/json',
        },
        }).then((response) => {status = response.status; return response.json()})
        .then((responseJson) => {
          setLoading(false);
          if (responseJson.success) {
            alert("Exito, poner snakc");
          } else if (status === 403) {
            alert("Fracaso, poner snnack");
            localStorage.removeItem("HUNToken");
            window.location.reload();
          } else {
            alert("Fracaso, poner snnack");
          }
        });
    }
  };

  const classes = useStyles();
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <React.Fragment>
          <Paper className={classes.paper}>
            <Title>Nuevo Indicador</Title>
            {
              loading ? 
              <div className="loader"></div> :
              <form className={classes.root} noValidate autoComplete="off">
                <TextField
                  margin="normal"
                  required
                  id="idUnit"
                  label="Unidad"
                  name="idUnit"
                  autoComplete="idUnit"
                  onChange={handleChange}
                  select
                  value={state.idUnit}
                  SelectProps={{native: true}}
                  autoFocus
                >
                  <option aria-label="None" value="" />
                  {
                    units.map((option) => (
                      <option key={option.nombre} value={option.idUnidad}>{option.nombre}</option>
                    ))
                  }
                </TextField>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Nombre del indicador"
                  name="name"
                  autoComplete="name"
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="definition"
                  label="Definición del indicador"
                  name="definition"
                  autoComplete="definition"
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="idPeriod"
                  label="Periodicidad"
                  name="idPeriod"
                  autoComplete="idPeriod"
                  onChange={handleChange}
                  select
                  value={state.idPeriod}
                  SelectProps={{native: true}}
                >
                  <option aria-label="None" value="" />
                  {
                    periods.map((option) => (
                      <option key={option.nombre} value={option.idPeriodo}>{camelToText(option.nombre)}</option>
                    ))
                  }
                </TextField>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="dataSource"
                  label="Origen o fuente de los datos"
                  name="dataSource"
                  autoComplete="dataSource"
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="formula"
                  label="Fórmula"
                  name="formula"
                  autoComplete="formula"
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="unitMeasurement"
                  label="Unindad de medición"
                  name="unitMeasurement"
                  autoComplete="unitMeasurement"
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="responsableData"
                  label="Responsable de recolectar datos del indicador"
                  name="responsableData"
                  autoComplete="responsableData"
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="responsableIndicator"
                  label="Responsable del indicador"
                  name="responsableIndicator"
                  autoComplete="responsableIndicator"
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="goal"
                  label="Meta"
                  name="goal"
                  autoComplete="goal"
                  type="number"
                  onChange={handleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="startCurrentPeriod"
                  label="Escoger primer periodo"
                  defaultValue={`${new Date().getFullYear()}-${new Date().getMonth()+1 < 10 ? "0" + (new Date().getMonth()+1): new Date().getMonth()+1}-${new Date().getDate()}`}
                  name="startCurrentPeriod"
                  autoComplete="startCurrentPeriod"
                  type="date"
                  onChange={handleDateChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleClick}
                >
                  Aceptar
                </Button>
              </form>
            } 
          </Paper>
        </React.Fragment>
      </Container>
    </main>
  );
}
