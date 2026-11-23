import type { ContactMessage } from './portfolio';

export function normalizeContact(input: ContactMessage): ContactMessage {
  return {
    name: input.name.trim().replace(/\s+/g, ' '),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim(),
  };
}

export function isValidContact(input: ContactMessage): boolean {
  return (
    input.name.length >= 2 &&
    input.name.length <= 100 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) &&
    input.message.length >= 10 &&
    input.message.length <= 2000
  );
}
