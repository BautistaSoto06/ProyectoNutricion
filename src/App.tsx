import BrownieSurvey from "./brownie";
import AdminDashboard from "./admin";

function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  return isAdmin ? <AdminDashboard /> : <BrownieSurvey />;
}

export default App;
