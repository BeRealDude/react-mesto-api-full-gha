import unionOk from "../../images/UnionOk.svg";
import unionNo from "../../images/UnionNo.svg";

function InfoTooltip(props) {
  const { onClose, isOpen, isRegistration, message } = props;
  return (
    <div className={`popup  ${isOpen && "popup_opened"}`}>
      <div className="popup__container_tooltip">
        <img
          className="popup__union"
          src={isRegistration ? unionOk : unionNo}
          alt="Подсказка"
        />
        <h3 className="popup__heading_tooltip">{isRegistration ? message : message}</h3>
        <button className="popup__close" type="button" onClick={onClose} />
      </div>
    </div>
  );
}

export default InfoTooltip;
