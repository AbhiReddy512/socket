import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [roomEntered, setRoomEntered] = useState(false);
  const handleReceiveMessage = (data) => {
    setReceivedMessages((prevMessages) => [...prevMessages, data]);
  };

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", room);
      setRoomEntered(true);
    }
  };

  const sendMsg = () => {
    if (message !== "" && room !== "") {
      socket.emit("message_send", { room, message, username });
    handleReceiveMessage({ message, room, username, isMine: true });
    setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  return (
    <div className="App">
      {roomEntered === false && (
        <div className="room-enter">
          <div className="f-r-sb">
            <label>Name</label>{" "}
            <input
              placeholder="Your Unique Name"
              onChange={(event) => setUsername(event.target.value)}
              value={username}
            />
          </div>
          <div className="f-r-sb">
            <label>room</label>
            <input
              placeholder="Room Number"
              onChange={(event) => setRoom(event.target.value)}
              value={room}
            />
          </div>
          <button onClick={joinRoom}>Join Room</button>
        </div>
      )}
      {roomEntered === true && (
        <>
          <div className="header-container">
            <div>{username}</div>
            <div>Room:{room}</div>
          </div>
          <div className="message-list">
            {receivedMessages.map((msg, index) => (
              <div
                key={index}
                className={msg.isMine ? "my-chat" : "other-chat"}
              >
                <label>{msg.username}</label>:<span>{msg.message}</span>
              </div>
            ))}
          </div>
          <div className="message-send">
            <input
              placeholder="Message..."
              onChange={(event) => setMessage(event.target.value)}
              value={message}
            />
            <button className="ml-6" onClick={sendMsg}>Send</button>
          </div>
        </>
      )}
      <div className="author-stamp">Chat App by <b>Abhisaik Kondam</b></div>
    </div>
  );
}

export default App;
