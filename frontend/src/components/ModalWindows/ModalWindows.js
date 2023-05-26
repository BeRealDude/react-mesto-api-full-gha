function ModalWindows({ data, ...props }) {
  const { onSubmit } = props;
  return (
    <section className={`modal modal_type_${data.classSelector}`}>
      <div className="modal__container">
        <h2 className="modal__heading">{data.title}</h2>
        <form
          className="formModal"
          name={data.user}
          id="user"
          onSubmit={onSubmit}
        >
          {props.children}
          <button
            type="submit"
            className="formModal__submit-btn form__profile-btn-save"
          >
            {data.submit}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ModalWindows;
