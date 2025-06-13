import React, { useEffect, useState } from "react";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const handleUserClick = user => setSelectedUser(user);
  const handleCloseModal = () => setSelectedUser(null);
  const handleDeleteUser = id => setUsers(users.filter(u => u.id !== id));

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>User Management</h1>
      <UserTable
        users={users}
        onUserClick={handleUserClick}
        onDeleteUser={handleDeleteUser}
      />
      {selectedUser && (
        <UserModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
  );
}