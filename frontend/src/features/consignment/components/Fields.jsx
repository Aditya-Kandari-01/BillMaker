function Field({ label, children }) {
  return (
    <div className="sx-field">
      <label className="sx-label">{label}</label>
      {children}
    </div>
  );
}
export default Field