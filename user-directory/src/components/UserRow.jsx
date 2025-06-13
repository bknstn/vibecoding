import React from "react";
import styles from "../styles/UserRow.module.css";

export default function UserRow({ user, onClick, onDelete }) {
  return (
    <tr className={styles.row} onClick={onClick}>
      <td>
        <strong>{user.name}</strong>
        <br />
        <span className={styles.email}>{user.email}</span>
      </td>
      <td>
        {user.address.street}, {user.address.suite}
        <br />
        {user.address.city}, {user.address.zipcode}
      </td>
      <td>{user.phone}</td>
      <td>
        <a
          href={`http://${user.website}`}
          onClick={e => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
        >
          {user.website}
        </a>
      </td>
      <td>{user.company.name}</td>
      <td>
        <button
          className={styles.deleteBtn}
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
        >Delete</button>
      </td>
    </tr>
  );
}