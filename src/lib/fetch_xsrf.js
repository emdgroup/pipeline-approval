export default function request(input, args = {}) {
  return fetch(input, Object.assign({
    method: args.method || 'POST',
  })).then(res => res.json());
}
