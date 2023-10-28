import "./App.css";
import MailReplies from "./pages/MailReplies";
import MailBody from "./pages/MailBody";
import ImportCSV from "./pages/ImportCSV"
import SendMail from "./pages/SendMail"
import Login from "./Auth/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<SendMail />} />
        <Route path="/sendmail" exact element={<SendMail />} />
        <Route path="/mailreplies" element={<MailReplies />} />
        <Route path="/mailbody" element={<MailBody />} />
        <Route path="/importcsv" element={<ImportCSV />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </div>
  );
}

export default App;
