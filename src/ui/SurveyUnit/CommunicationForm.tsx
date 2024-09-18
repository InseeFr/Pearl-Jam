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
  let mediums = mediumRadioValues.map(m => {
    return {
      value: m.value,
      label: m.label,
      disabled: !communicationTemplates.some(c => c.medium.value === m.value),
    };
  });

  communicationTemplates = communicationTemplates.filter(
    item => item.medium.value === communicationRequest.medium
  );

  let types = typeRadioValues.map(t => {
    return {
      value: t.value,
      label: t.label,
      disabled: !communicationTemplates.some(c => c.type.value === t.value),
    };
  });

  let reasons = reasonRadioValues.map(r => {
    return {
      value: r.value,
      label: r.label,
      disabled: !communicationTemplates.some(
        c => c.type.value === communicationTypeEnum.COMMUNICATION_REMINDER.value
      ),
    };
  });
  // If reminder is not selected as a type, the user does not have to set a reason (therefore setting it automatically here)
  if (
    communicationRequest.type !== communicationTypeEnum.COMMUNICATION_REMINDER.value &&
    communicationRequest.reason !== communicationReasonEnum.UNREACHABLE.value
  )
    setCommunicationRequest({
      ...communicationRequest,
      reason: communicationReasonEnum.UNREACHABLE.value,
    });

  const nextStep = () => {
    if (step < Steps.VALIDATE) setStep(Steps.after(step));
  };

  const previousStep = () => {
    if (!isFirst) {
      setStep(Steps.before(step));
    }
  };
