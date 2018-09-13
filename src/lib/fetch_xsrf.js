export default function request(input, args = {}) {
  return fetch(
    input,
    Object.assign({
      method: args.method || 'POST',
      mode: 'no-cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }),
  ).then(res => res.json());
}
