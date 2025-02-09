import crypto from "crypto";

export const generateVerificationLinkToken = () => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = Date.now() + 3600000;

  return { verificationToken, verificationTokenExpiry };
};
