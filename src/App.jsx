import { useState } from "react";
import CurrencyConverter from "./CurrencyConverter.jsx";

function App() {
  const [count, setCount] = useState(0);

  return <CurrencyConverter />;
}

export default App;
