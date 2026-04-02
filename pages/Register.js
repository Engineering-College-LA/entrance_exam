function Register({ onSubmit, onBack }) {
  const { form, set } = useFormState(REGISTRATION_FIELDS);
  const handleSubmit = () => {
    const { valid } = ValidationService.registration(form);
    if (!valid) { alert("Please fill in First Name, Last Name and Email."); return; }
    onSubmit(form);
  };
  const rows = [[0, 1], [2, 3], [4, 5]];
  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: "48px 20px" }}>
      <Breadcrumb items={[{ text: "college.edu.kg" }, { text: "Math Exam", highlight: true }, { text: "Registration" }]} />
      <StepBar current="register" />
      <div style={{ ...Styles.card, overflow: "hidden" }}>
        <div style={Styles.cardHeader}>
          <div style={{ width: 44, height: 44, borderRadius: 6, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📋</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: COLORS.white }}>Exam Registration</div>
            <div style={{ color: "#8fa3c0", fontSize: 13, marginTop: 3 }}>Fill in your details to proceed to the exam</div>
          </div>
        </div>
        <div style={{ padding: 28 }}>
          <InfoBanner icon="ℹ" text="Your information is securely linked to your exam attempt." bg="#f0f6ff" borderColor="#c5d9f5" color={COLORS.blue} />
          {rows.map((pair, ri) => (
            <div key={ri} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              {pair.map(fi => <FormField key={REGISTRATION_FIELDS[fi].key} field={REGISTRATION_FIELDS[fi]} value={form[REGISTRATION_FIELDS[fi].key]} onChange={set(REGISTRATION_FIELDS[fi].key)} />)}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
            <button onClick={onBack} style={Styles.btnGhost}>← Back</button>
            <button onClick={handleSubmit} style={Styles.btnPrimary()}>Continue to Instructions →</button>
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 6, alignItems: "center" }}>🔒 Your data is securely recorded.</div>
        </div>
      </div>
    </div>
  );
}
