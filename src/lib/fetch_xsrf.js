export default function request(input) {
  return fetch(input, { mode: 'no-cors' }).then(res => res.json());
}
