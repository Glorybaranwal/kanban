import { ThemeProvider, CssBaseline, IconButton } from '@mui/material';
import { useState } from 'react';
import { lightTheme, darkTheme } from '@components/theme/theme';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { TaskProvider } from '@components/context/task';

const MyApp = ({ Component, pageProps }: any) => {
  // State to toggle between light and dark themes
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline /> {/* Reset CSS to match theme */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 10 }}>
        <IconButton color="inherit" onClick={toggleTheme}>
          {themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </div>
      <TaskProvider>
        <Component {...pageProps} />
      </TaskProvider>
    </ThemeProvider>
  );
};

export default MyApp;
