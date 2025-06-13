import React from "react";
import UserRow from "./UserRow";
import styles from "../styles/UserTable.module.css";

export default function UserTable({ users, onUserClick, onDeleteUser }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name / Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <UserRow
              key={user.id}
              user={user}
              onClick={() => onUserClick(user)}
              onDelete={() => onDeleteUser(user.id)}
            />
          )}
        </tbody>
      </table>
    </div>
  );
}