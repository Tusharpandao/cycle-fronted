import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1 className="text-3xl font-bold mb-4">🏡 Home Page</h1>
      <Link to="/items" className="px-4 my-3 py-2 bg-green-700 text-white rounded">Go to item Page</Link>
      <Link to="/about" className="px-4my-3 py-2 bg-blue-500 text-white rounded"> Go to About</Link>
      <Link to="/estimates" className="px-4 my-3 py-2 bg-blue-900 text-white rounded">Go to estimates</Link>
      <Link to="/signIn" className="px-4 py-2 my-3 bg-green-500 text-white rounded">Go to SignIn</Link>
      <Link to="/signUp" className="px-4 py-2 my-3 bg-orange-300 text-white rounded">Go to Sign Up</Link>
      

    </div>
  );
}

export default Home;

