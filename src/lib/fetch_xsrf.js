export default function request(input) {
  return fetch(input, { mode: 'cors' }).then((res) => {
    if (res.ok) return res.json();
    return Promise.reject(res);
  });
}
