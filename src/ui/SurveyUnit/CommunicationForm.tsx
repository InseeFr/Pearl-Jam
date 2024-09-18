enum Steps {
  MEDIUM,
  TYPE,
  REASON,
  VALIDATE,
}

namespace Steps {
  export function after(value: Steps): Steps {
    return value + 1;
  }

  export function before(value: Steps): Steps {
    return value - 1;
  }
}
  const nextStep = () => {
    if (step < Steps.VALIDATE) setStep(Steps.after(step));
  };

  const previousStep = () => {
    if (!isFirst) {
      setStep(Steps.before(step));
    }
  };
