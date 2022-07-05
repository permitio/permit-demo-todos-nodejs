import { AppBar, Grid } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { AppContent } from './AppContent';
import ApiClientProvider from './Components/API/ApiClientProvider';
import AuthenticationButton from './Components/Auth/AuthenticationButton';
import AuthenticationContextProvider from './Components/Auth/AuthenticationContextProvider';
import PexelsBackground from './Components/PexelsBackground';
import Logo from './logo-light.png';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

function App() {
  const classes = useStyles();

  return (
    <Router>
      <AuthenticationContextProvider>
        <ApiClientProvider>
          <div style={{ backgroundColor: grey[200], minHeight: '100vh' }}>
            <PexelsBackground>
              <SnackbarProvider maxSnack={3}>
                <AppBar position='static' style={{ backgroundColor: "rgb(255 255 255 / 80%)" }}>
                  <Toolbar>

                    <div className={classes.title}>
                      <img style={{ height: 40 }} alt='logo' src={Logo}></img>
                    </div>

                    <AuthenticationButton />
                  </Toolbar>
                </AppBar>

                <Grid container>
                  <Grid item xs={1} />
                  <Grid item xs={10}>
                    <AppContent />
                  </Grid>
                </Grid>
              </SnackbarProvider>
            </PexelsBackground>
          </div>
        </ApiClientProvider>
      </AuthenticationContextProvider>
    </Router>
  );
}

export default App;
