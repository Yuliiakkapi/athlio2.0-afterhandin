export default function StepContainer({
  children,
  onBack,
  onNext,
  onFinish,
  showBack,
  showNext,
  showFinish,
}) {
  return (
    <div>
      <div>{children}</div>
      <div>
        {showBack && (
          <button type="button" onClick={onBack}>
            Back
          </button>
        )}
        {showNext && (
          <button type="button" onClick={onNext}>
            Next
          </button>
        )}
        {showFinish && (
          <button type="button" onClick={onFinish}>
            Finish
          </button>
        )}
      </div>
    </div>
  );
}
