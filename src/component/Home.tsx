
function Home() {
  return (
    <div className="h-screen bg-black relative overflow-hidden flex flex-col justify-center">
      {/* Top content */}
      <div className="flex flex-col items-center justify-center p-6 text-center relative z-10">
        <h1 className="text-6xl font-bold text-white">
          Wave<span className="text-green-300">Scan</span>
        </h1>


        {/* Logo/image */}
        <img
          src="/src/assets/ws.png"
          alt="WaveScan"
          className="w-82 h-82 mt-6 "
        />
       
        
          <button className="w-full h-15 bg-white mt-10 rounded-2xl text-2xl text-black font-bold">
             Scan Now
          </button>
      </div>

      {/* Curved Background at Bottom */}
      <div
        className="absolute bottom-0 w-full h-1/2 bg-green-900"
        style={{
          clipPath: "ellipse(120% 80% at 50% 100%)", // centered curve
        }}
      ></div>
    </div>
  );
}

export default Home;
