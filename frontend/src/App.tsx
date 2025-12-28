import React from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Tokenize } from "./components/Tokenize";
import { Vault } from "./components/Vault";
import { Compliance } from "./components/Compliance";

function App() {
  const [activeTab, setActiveTab] = React.useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "tokenize":
        return <Tokenize />;
      case "vault":
        return <Vault />;
      case "compliance":
        return <Compliance />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
