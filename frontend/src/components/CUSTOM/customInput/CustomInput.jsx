import "./CustomInput.scss";

const CustomInput = (item) => {
  return (
    <div className="custom-input">
      <input
        className="custom-input-field"
        type={item.type}
        name={item.name}
        onChange={item.onchange}
        value={item.value}
      />

      <label
        className={`${item.value !== "" ? "not-empty" : ""}`}
        htmlFor={item.id}
      >
        {item.label}
      </label>
    </div>
  );
};

export default CustomInput;
