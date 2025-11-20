function Popup({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button style={styles.closeBtn} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  popup: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    minWidth: "300px",
    position: "relative"
  },
  closeBtn: {
    position: "absolute",
    right: "10px",
    top: "10px",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    fontSize: "18px"
  }
};

export default Popup;
