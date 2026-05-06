export default function Stepper({ steps, current }) {
  return (
    <ol>
      {steps.map((s, i) => (
        <li key={s}>
          <span>{i + 1}</span> <span>{s}</span>{" "}
          {i === current ? "(current)" : ""}
        </li>
      ))}
    </ol>
  );
}
