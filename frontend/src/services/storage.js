const DRAFT_KEY = "sfw_transaction_drafts";

export function saveDraft(draft) {
  const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]");
  drafts.push({ ...draft, savedAt: new Date().toISOString() });
  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
}

export function getDrafts() {
  return JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]");
}

export function clearDrafts() {
  localStorage.removeItem(DRAFT_KEY);
}

export function saveUserSession(token, user) {
  localStorage.setItem("sfw_token", token);
  localStorage.setItem("sfw_user", JSON.stringify(user));
}

export function getStoredUser() {
  const raw = localStorage.getItem("sfw_user");
  return raw ? JSON.parse(raw) : null;
}
