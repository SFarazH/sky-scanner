import "./index.css";
import TravelBooking from "./TravelBooking";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-sky-900">
          SkyJourney Travel
        </h1>
        <TravelBooking />
      </div>
    </div>
  );
}

export default App;
