import logo from './logo.svg';
import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Frete from './pages/Frete';
// import RotaPrivadaLayout from './components/layout/RotaPrivadaLayout';
// import PadraoLayout from './components/layout/PadraoLayout';


function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/frete" element={<Frete />} />
          </Routes>
        </BrowserRouter>
      {/* <Footer /> */}
    </>
  );
}
 
export default App;
