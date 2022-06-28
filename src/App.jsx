import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
export default function App() {
  const [data, setData] = useState([]);
  const [clicked, setClicked] = useState("");
  const [flag, setFlag] = useState(false);

  const fetchData = () => {
    const url1 =
      "https://api.unsplash.com/photos/?client_id=67dzJ6HsOJ0oE9moFGN9_AGJ-de6jwkL-CAULtu3QWg&page=3";
    const url2 =
      "https://api.unsplash.com/photos/?client_id=67dzJ6HsOJ0oE9moFGN9_AGJ-de6jwkL-CAULtu3QWg&page=4";

    axios.all([axios.get(url1), axios.get(url2)]).then(([page1, page2]) => {
      const combined = [...page1.data, ...page2.data];

      console.log(combined);
      function shuffle(array) {
        for (let i in array) {
          let temp = Math.floor(Math.random() * array.length); //1
          let curr = array[temp]; //d
          array[temp] = array[i];
          array[i] = curr;
        }
        return array;
      }
      let shuffledData = shuffle([
        ...combined.slice(0, 12),
        ...combined.slice(0, 12)
      ]);

      let afterUniqueId = shuffledData.map((i) => {
        return { ...i, uuid: nanoid() };
      });
      setData(afterUniqueId);
    });
  };
  const handleClick = (item) => {
    if (!flag) {
      console.log(item.id, "<<<");
      let foundItem = data.findIndex((i) => i.uuid === item.uuid);
      let newData = [...data];
      newData[foundItem].liked_by_user = true;
      console.log(newData);
      setData(newData);
      setClicked(item.id);
      if (clicked !== item.id && clicked) {
        console.log("try again");
        let newItems = data.map((el) =>
          el.uuid ? { ...el, liked_by_user: false } : el
        );
        setFlag(true);
        setTimeout(() => {
          setData(newItems);
          setFlag(false);
          setClicked("");
        }, 2000);
      } else if (clicked === item.id) {
        console.log("keep going");
        setClicked("");
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(data);
  return (
    <div className="App">
      {data.length &&
        data.map((item) => {
          return (
            <div
              key={item.uuid}
              className="single-card"
              onClick={() => handleClick(item)}
            >
              <img
                className={!item.liked_by_user ? "show" : ""}
                src={item.urls.thumb}
                alt=""
              />
            </div>
          );
        })}
    </div>
  );
}
