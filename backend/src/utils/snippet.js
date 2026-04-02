export function snippetFrom(body) {
  return body.replace(/\s+/g, " ").trim().slice(0, 120);
}
