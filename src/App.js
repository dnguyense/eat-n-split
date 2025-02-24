import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }
  function handleSelection(friend) {
    setSelectedFriend(friend);
  }
  function handleSplitBill(value) {
    setFriends(
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        ></FriendsList>
        {showAddFriend && (
          <FormAddFriend onAddFriend={handleAddFriend}></FormAddFriend>
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        ></FormSplitBill>
      )}
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend && selectedFriend.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You own {friend.name} {Math.abs(friend.balance)} $
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} own you {Math.abs(friend.balance)} $
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>Select</Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("https://i.pravatar.cc/48?");
  function handleAddFriendSubmit(e) {
    e.preventDefault();
    if (!name || !imageURL) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${imageURL}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImageURL("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddFriendSubmit}>
      <label>Friend name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>Image URL:</label>
      <input
        type="text"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByYou, setPaidByYou] = useState("");
  const paidByFriend = bill ? bill - paidByYou : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByYou) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByYou);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split Bill {selectedFriend.name}</h2>
      <label>Total Bill:</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>Your expense:</label>
      <input
        type="text"
        value={paidByYou}
        onChange={(e) => setPaidByYou(Number(e.target.value))}
      ></input>
      <label>{selectedFriend.name}'s expense:</label>
      <input type="text" value={paidByFriend} disabled></input>
      <label>Who pay the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split</Button>
    </form>
  );
}
