'use strict';

const timeOut = (err) => {
  return setTimeout(() => {
    return Promise.reject(
      new Error(err)
    );
  }, 5000);
};

const request = (url) => {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(
          new Error(`${response.status} - ${response.statusText}`)
        );
      }

      if (!response.headers.get('content-type').includes('application/json')) {
        return Promise.reject(
          new Error('Response is not JSON')
        );
      }

      return response.json();
    })
    .catch(err => timeOut(err));
};

// Urls
const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';
const listUrl = `${BASE_URL}/phones.json`;
const detailsUrl = `${BASE_URL}/phones/:phoneId.json`;

// Elements
const body = document.querySelector('body');
const main = document.createElement('main');
const ul = document.createElement('ul');

const h1 = document.querySelector('h1');

h1.style.margin = '40px auto 80px';

main.appendChild(h1);

body.appendChild(main);
main.appendChild(ul);

// Display phones
const displayPhones = (phones) => {
  phones.forEach(phone => {
    const li = document.createElement('li');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');

    li.dataset.id = phone.id;

    h2.textContent = phone.name;
    p.textContent = phone.snippet;

    ul.append(li);
    li.append(h2);
    li.append(p);
    li.classList.add('phone__item');
  });
};

// Display details
const displayDetail = (detail, phoneId) => {
  const li = document.querySelector(`[data-id="${phoneId}"]`);
  const p = document.createElement('p');

  p.textContent = detail.description;

  li.append(p);
};

// Initilize
const init = () => {
  request(listUrl).then(phones => {
    const phonesId = phones.map(phone => phone.id);

    displayPhones(phones);

    phonesId.map(id => {
      return request(detailsUrl.replace(':phoneId', id))
        .then(detail => {
          displayDetail(detail, id);
        });
    });
  });
};

init();
