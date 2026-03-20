import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import AppLayout from "./component/Applayout";
import { Catalogue } from "./pages/Catalogue";
import { Chat } from "./pages/Chat";
import { Insights } from "./pages/Insights";
import { InsightsTwo } from "./pages/InsightsTwo";
import { InsightsSurvey } from "./pages/InsightsSurvey";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights_two" element={<InsightsTwo />} />
          <Route path="/insights_survey" element={<InsightsSurvey />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
