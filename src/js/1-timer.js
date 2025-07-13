import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

class CountdownTimer {
  constructor({ dateInputSelector, startBtnSelector, outputSelectors }) {
    this.dateInput = document.querySelector(dateInputSelector);
    this.startBtn = document.querySelector(startBtnSelector);
    this.outputEls = {
      days: document.querySelector(outputSelectors.days),
      hours: document.querySelector(outputSelectors.hours),
      minutes: document.querySelector(outputSelectors.minutes),
      seconds: document.querySelector(outputSelectors.seconds),
    };

    this.targetDate = null;
    this.intervalId = null;
    this.init();
  }

  init() {
    this.startBtn.disabled = true;
    this.startBtn.addEventListener('click', this.start.bind(this));
    flatpickr(this.dateInput, {
      enableTime: true,
      time_24hr: true,
      defaultDate: new Date(),
      minuteIncrement: 1,
      onClose: this.handleDateSelect.bind(this),
    });
  }

  handleDateSelect(selectedDates) {
    const selected = selectedDates[0];
    const now = new Date();
    if (selected <= now) {
      iziToast.error({
        title: 'Error',
        message: 'Illegal operation',
        position: 'topRight',
      });
      this.startBtn.disabled = true;
      return;
    }

    this.targetDate = selected;
    this.startBtn.disabled = false;
  }
  start() {
    if (!this.targetDate) return;
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      const now = new Date();
      const diff = this.targetDate - now;
      if (diff <= 0) {
        clearInterval(this.intervalId);
        this.updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        iziToast.success({
          title: 'Timer',
          message: 'Countdown finished!',
          position: 'topRight',
        });
        return;
      }
      const time = this.convertMs(diff);
      this.updateDisplay(time);
    }, 1000);
  }

  updateDisplay({ days, hours, minutes, seconds }) {
    this.outputEls.days.textContent = String(days).padStart(2, '0');
    this.outputEls.hours.textContent = String(hours).padStart(2, '0');
    this.outputEls.minutes.textContent = String(minutes).padStart(2, '0');
    this.outputEls.seconds.textContent = String(seconds).padStart(2, '0');
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    return { days, hours, minutes, seconds };
  }
}

new CountdownTimer({
  dateInputSelector: '#datetime-picker',
  startBtnSelector: '[data-start]',
  outputSelectors: {
    days: '[data-days]',
    hours: '[data-hours]',
    minutes: '[data-minutes]',
    seconds: '[data-seconds]',
  },
});
