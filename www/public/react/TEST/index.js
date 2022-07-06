import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from 'arwes';

const App = () => (
  <ThemeProvider theme={createTheme()}>
    <div>My Project</div>
  </ThemeProvider>
);

ReactDOM.render(<App />, document.querySelector('#root'));