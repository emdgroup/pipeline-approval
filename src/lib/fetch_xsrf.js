export default function request(input) {
  return fetch(input, { mode: 'cors' }).then(res => res.json());
}
