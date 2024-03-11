import './App.css';
import { DataGridPro, GridFilterModel, GridToolbar, useGridApiRef } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import { useCallback, useEffect, useState } from 'react';
import { GridStatePro } from '@mui/x-data-grid-pro/models/gridStatePro';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

function App() {
  const [serverSideFiltering, setServeSideFiltering] = useState<boolean>(false);

  const { data } = useDemoData({
    dataSet: "Employee",  
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const apiRef = useGridApiRef();

  const onFilterChange = useCallback((filterModel: GridFilterModel) => {
    // Here we can save the data you need from the filter model
    console.log(filterModel);
  }, []);

  const saveState = () => {
    const stateJson = JSON.stringify(apiRef.current.exportState());
    window.localStorage.setItem('gridState', stateJson);
  };

  const restoreState = () => {
    const stateJson = window.localStorage.getItem('gridState');
    if (stateJson === null) return;

    const parsedState = JSON.parse(stateJson as string) as GridStatePro;
    apiRef.current.restoreState(parsedState);
  };
  
  useEffect(() => {
    // restore state on load
    // restoreState();
  }, []);

  return (
    <div className="App">
      <h3>DataGrid Demo</h3>

      <p>
        <label>
          <input type="checkbox" checked={serverSideFiltering} onChange={() => setServeSideFiltering(!serverSideFiltering)} />
          Server-side filtering enabled
        </label>
      </p>

      <p>
        <button onClick={saveState}>Save Grid State</button>
        <button onClick={restoreState}>Restore Grid State</button>
      </p>

      <DataGridPro {...data}
      slots={{toolbar: GridToolbar}}
      filterMode={serverSideFiltering ? 'server' : 'client'}
      onFilterModelChange={onFilterChange}
      apiRef={apiRef}
      slotProps={{
        filterPanel: {
          columnsSort: 'asc',
          filterFormProps: {
            columnInputProps: {
            }
          }
        }
      }} />
    </div>
  );
}

export default App;
