import { useState } from "react";
import {Link }from "react-router-dom"
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState(null);

  return (
    <>
      <nav className="bg-white/10 backdrop-blur m-2 p-2 flex justify-between items-center font-semibold">
        <Link to={"/"} className="text-lg">BillMaker</Link>

        <div className="flex gap-6 text-sm">
          <button onClick={() => navigate("/consignment")} className="hover:text-orange-400 transition">
            Consignment
          </button>
        </div>

        <div className="flex gap-6 text-sm">
          <button className="hover:text-orange-400 transition">
            Past Orders
          </button>
        </div>
        

        <div>
          <button onClick={()=>{
            navigate("/login")
          }} className="bg-orange-500 px-4 py-1 rounded-lg text-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="min-h-screen bg-[#0f172a] text-white p-4 pb-20">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold">Hi, Aditya 👋</h1>
            <p className="text-sm text-gray-400">Whitefield, Bangalore</p>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              isOnline ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur p-3 rounded-xl text-center">
            <p className="text-sm text-gray-300">Orders</p>
            <p className="text-lg font-semibold">5</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-3 rounded-xl text-center">
            <p className="text-sm text-gray-300">Earnings</p>
            <p className="text-lg font-semibold">₹850</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-3 rounded-xl text-center">
            <p className="text-sm text-gray-300">Rating</p>
            <p className="text-lg font-semibold">4.8 ⭐</p>
          </div>
        </div>

        {/* ACTIVE DELIVERY */}
        {/* {isOnline
          ? activeDelivery && (
              <div className="bg-orange-500/20 border border-orange-400 p-4 rounded-xl mb-4">
                <h2 className="text-lg font-semibold mb-2">
                  🚚 Active Delivery
                </h2>
                <p>
                  {activeDelivery.pickup} → {activeDelivery.drop}
                </p>
                <p className="text-sm text-gray-300">
                  {activeDelivery.distance} • ₹{activeDelivery.amount}
                </p>

                <div className="flex gap-2 mt-3">
                  <button className="bg-orange-500 px-3 py-1 rounded-lg">
                    Start Pickup
                  </button>
                  <button className="bg-green-500 px-3 py-1 rounded-lg">
                    Complete
                  </button>
                </div>
              </div>
            )
          : ""} */}

        {/* DELIVERY LIST */}
        {/* <div>
          <h2 className="text-lg font-semibold mb-2">
            📦 Available Deliveries
          </h2>

          {!isOnline && (
            <p className="text-gray-400 text-sm">Go online to see deliveries</p>
          )}

          {isOnline &&
            deliveries.map((d) => (
              <div
                key={d.id}
                className="bg-white/10 backdrop-blur p-4 rounded-xl mb-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {d.pickup} → {d.drop}
                  </p>
                  <p className="text-sm text-gray-400">
                    {d.distance} • ₹{d.amount}
                  </p>
                </div>

                <button
                  onClick={() => handleAccept(d)}
                  className="bg-orange-500 px-3 py-2 rounded-lg text-sm"
                >
                  Accept
                </button>
              </div>
            ))}
        </div> */}

        {/* BOTTOM NAV */}
        {/* <div className="fixed bottom-0 left-0 w-full bg-[#020617] border-t border-gray-800 flex justify-around py-3">
          <button className="text-orange-400">🏠</button>
          <button>📦</button>
          <button>💰</button>
          <button>👤</button>
        </div> */}
      </div>
    </>
  );
};

export default Home;
