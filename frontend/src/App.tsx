import React from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Tokenize } from "./components/Tokenize";
import { Vault } from "./components/Vault";
import { Compliance } from "./components/Compliance";
import { LandingPage } from "./components/LandingPage";

function App() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [showLanding, setShowLanding] = React.useState(true);

  const handleGetStarted = () => {
    setShowLanding(false);
    setActiveTab("dashboard");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "tokenize":
        return <Tokenize setActiveTab={setActiveTab} />;
      case "vault":
        return <Vault />;
      case "compliance":
        return <Compliance />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
