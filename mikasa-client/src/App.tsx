import "./App.css";
import axios from "axios";

function App() {
  const hehe = async () => {
    axios.post(
      `http://localhost:3000/mikasa/financier`,
      {
        query: "I spent 838 on mobile recharge via sbi & 500 on dinner",
      },
      {
        headers: {
          "x-api-key": "secret_falcon_14ML0501",
        },
      }
    );
  };

  return <button onClick={hehe}>hit</button>;
}

export default App;
