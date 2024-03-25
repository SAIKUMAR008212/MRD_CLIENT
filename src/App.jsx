import React, { useState } from "react";
import Result from "./Result";

const App = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [songData, setSongData] = useState([]);

  const fetchData = async (songName) => {
    setLoading(true);
    fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_name: songName }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetch("http://localhost:8000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((sData) => {
            setSongData(sData);
            console.log(sData);
            setLoading(false);
          });
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const songName = formData.get("songName");
    console.log(songName);
    fetchData(songName);
    setFormSubmitted(true);
  };

  return (
    <div
      className={
        "w-screen dark:bg-black h-screen flex flex-col px-[5rem] max-sm:px-[1rem] items-center justify-center"
      }
    >
      <h1
        className={`mt-10 mb-5 max-sm:text-2xl max-sm:mb-10 bg-clip-text text-transparent bg-gradient-to-r from-secondary from-10% to-primary to-50% ${
          formSubmitted ? "mb-[0rem]" : "mb-[10rem]"
        } w-full text-4xl text-primary font-bold tracking-wider`}
      >
        Music Recommendation System
      </h1>
        <>
          <div className="w-full flex items-center justify-center h-[5rem]">
            <form
              onSubmit={handleSubmit}
              action=""
              method="post"
              className="w-full flex max-sm:flex-col items-center justify-center"
            >
              <input
                type="text"
                name="songName"
                className={` ${
                  formSubmitted ? "" : "input-lg"
                } input max-sm:mb-3 input-bordered max-sm:input-md border-2 max-sm:border-1 tracking-wider text-primary text-xl max-sm:tracking-wide focus:outline-none input-primary w-full rounded-xl placeholder:text-xl max-sm:placeholder:text-sm placeholder:text-primary`}
                placeholder="Enter a song name to get the similar music"
                minLength={3}
                required
              />
              <button
                type="submit"
                className={`btn ${
                  formSubmitted ? "" : "btn-lg"
                } max-sm:w-full btn-primary rounded-2xl sm:ml-3`}
              >
                Search
              </button>
            </form>
          </div>
          {formSubmitted && (
            <div
              className={`w-full overflow-y-scroll p-2 h-full ${
                isLoading ? "animate-pulse" : ""
              } rounded-xl bg-slate-800 my-5`}
            >
              {songData.map((song, index) => (
                <Result
                  key={index}
                  {...song}
                />
              ))}
            </div>
          )}
        </>
    </div>
  );
};

export default App;
