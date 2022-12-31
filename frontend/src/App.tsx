import React from 'react';
import './App.css';
import {EDR} from "./EDR";
import "./index.css"
import {DarkThemeToggle, Flowbite, useThemeMode} from "flowbite-react";

function App() {
    const [mode, setMode, toggleMode] = useThemeMode(true);
  return (
      <Flowbite>
          <div className="min-h-screen dark:bg-slate-800">
            <EDR />
          </div>
      </Flowbite>
  );
}

export default App;
