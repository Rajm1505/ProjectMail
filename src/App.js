import "./App.css";
import Home from "./pages/Home";
import MailReplies from "./pages/MailReplies";
import MailBody from "./pages/MailBody";
import ImportCSV from "./pages/ImportCSV"
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/mailreplies" element={<MailReplies />} />
        <Route path="/mailbody" element={<MailBody />} />
        <Route path="/importcsv" element={<ImportCSV />} />
      </Routes>
    </div>
  );
}

export default App;
