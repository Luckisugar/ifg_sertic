export const mascararEmail = (email: string): string => {
    const [localPart, domain] = email.split("@");
  
    const maskedLocal =
      localPart.length <= 4
        ? localPart[0] + "*".repeat(localPart.length - 2) + localPart.slice(-1)
        : localPart.slice(0, 2) + "*".repeat(localPart.length - 4) + localPart.slice(-2);
  
    return `${maskedLocal}@${domain}`;
  };
  