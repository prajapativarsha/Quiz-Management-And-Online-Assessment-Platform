import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';


function App() {
  return (
      <BrowserRouter>
       
       {/* Main content wrapper */}
      <main className="min-h-screen bg-gray-50 "> 
        <AppRoutes />
      </main>

      </BrowserRouter>
  );
}

export default App;
