import "./Emptydata.scss";
import sleepingDog from "../../assets/icons/empty-box (1).png";

const Emptydata = () => {
  return (
    <div className="emptydata">
      <img src={sleepingDog} alt="Sleeping dog illustration" />
      <p
        style={{ fontWeight: 700, margin: "7px 0" }}
        className="title-empty-data"
      >
        No Data Available
      </p>
      <p className="description">
        There’s nothing to show right now. Please check back later or try
        refreshing the page.
      </p>
    </div>
  );
};

export default Emptydata;
