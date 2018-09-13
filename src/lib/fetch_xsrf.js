export default function request(input, args = {}) {
  return fetch(input, Object.assign({
    method: args.method || 'POST',
    mode: 'no-cors',
  })).then(res => res.json());
}
