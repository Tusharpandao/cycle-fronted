import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">🏡 Home Page</h1>
      <Link to="/about" className="px-4 py-2 bg-blue-500 text-white rounded">Go to About</Link>
      <Link to="/calculateForm" className="px-4 py-2 bg-red-300 text-white rounded">Go to Calculate</Link>
      <Link to="/estimates" className="px-4 py-2 bg-blue-900 text-white rounded">Go to estimates</Link>
      <Link to="/signIn" className="px-4 py-2 bg-green-200 text-white rounded">Go to SignIn</Link>
      <Link to="/signUp" className="px-4 py-2 bg-yellow-200 text-white rounded">Go to Sign Up</Link>

    </div>
  );
}

export default Home;
