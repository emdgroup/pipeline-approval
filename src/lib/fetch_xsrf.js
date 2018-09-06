export default function request(input, args = {}) {
  return fetch(input, Object.assign({
    credentials: 'include',
    method: args.method || 'POST',
  })).then(res => res.json());
}
