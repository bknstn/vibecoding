import React from "react";
import styles from "../styles/UserModal.module.css";

export default function UserModal({ user, onClose }) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${user.address.geo.lat},${user.address.geo.lng}`;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <h2>
          {user.name} <span className={styles.username}>@{user.username}</span>
        </h2>
        <div className={styles.infoBlock}>
          <strong>Email:</strong> {user.email}
        </div>
        <div className={styles.infoBlock}>
          <strong>Phone:</strong> {user.phone}
        </div>
        <div className={styles.infoBlock}>
          <strong>Website:</strong>{" "}
          <a
            href={`http://${user.website}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {user.website}
          </a>
        </div>
        <div className={styles.infoBlock}>
          <strong>Address:</strong> {user.address.street}, {user.address.suite},{" "}
          {user.address.city}, {user.address.zipcode}
        </div>
        <div className={styles.infoBlock}>
          <strong>Geo:</strong>{" "}
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            View on Map
          </a>
        </div>
        <div className={styles.infoBlock}>
          <strong>Company:</strong> {user.company.name}
          <br />
          <small>{user.company.catchPhrase}</small>
        </div>
      </div>
    </div>
  );
}