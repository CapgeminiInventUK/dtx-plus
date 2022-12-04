import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

function Options() {
  const [color, setColor] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [like, setLike] = useState<boolean>(false);

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        favouriteColor: "red",
        likesColor: true,
      },
      (items) => {
        setColor(items.favouriteColor);
        setLike(items.likesColor);
      },
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        favouriteColor: color,
        likesColor: like,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
      },
    );
  };

  return (
    <>
      <div>
        Favourite color:{" "}
        <select value={color} onChange={(event) => setColor(event.target.value)}>
          <option value="red">red</option>
          <option value="green">green</option>
          <option value="blue">blue</option>
          <option value="yellow">yellow</option>
        </select>
      </div>
      <div>
        <label htmlFor="id">
          <input
            type="checkbox"
            id="like"
            checked={like}
            onChange={(event) => setLike(event.target.checked)}
          />
          I like colours
        </label>
      </div>
      <div>{status}</div>
      <button type="button" onClick={saveOptions}>
        Save
      </button>
    </>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root"),
);
