import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.snackbar-form');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  createPromise(delay, state)
    .then(ms => {
      iziToast.success({
        title: '✅ Success',
        message: `Fulfilled promise in ${ms}ms`,
        position: 'topRight',
      });
    })

    .catch(ms => {
      iziToast.error({
        title: '❌ Error',
        message: `Rejected promise in ${ms}ms`,
        position: 'topRight',
      });
    });

  form.reset();
});

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}
