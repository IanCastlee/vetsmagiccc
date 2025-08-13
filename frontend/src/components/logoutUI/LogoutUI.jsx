import "./LogoutUI.scss";

const LogoutUI = () => {
  return (
    <div className="logout-overlay">
      <div className="logout-ui">
        <div className="loader-containerrr">
          <span className="loaderrr"></span>
          <p>Logging out...</p>
        </div>
      </div>
    </div>
  );
};

export default LogoutUI;
