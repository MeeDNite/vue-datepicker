import { computed, ref } from 'vue';
import { toPersianNumbers } from '@/utils/toPersianNumbers';
import {
  jalaaliToday,
  jalaaliMonthLength,
  getJalaaliMonthName,
  getJalaaliWeekdays,
  getJalaaliWeekday,
} from '@/utils/jalaali';

function parseJalaaliDate(date) {
  if (!date) return null;

  if (typeof date === 'string') {
    const parts = date.split('/').map(Number);
    if (parts.length === 3) {
      return { jy: parts[0], jm: parts[1], jd: parts[2] };
    }
    return null;
  }

  if (typeof date === 'object' && date.jy && date.jm && date.jd) {
    return { jy: date.jy, jm: date.jm, jd: date.jd };
  }

  return null;
}

function compareDates(a, b) {
  if (a.jy !== b.jy) return a.jy - b.jy;
  if (a.jm !== b.jm) return a.jm - b.jm;
  return a.jd - b.jd;
}

export function useDatePicker(options = {}) {
  const {
    locale = 'fa',
    mode = 'single',
    initialValue = null,
    minDate = null,
    maxDate = null,
  } = options;

  const today = jalaaliToday();
  const parsedMinDate = parseJalaaliDate(minDate);
  const parsedMaxDate = parseJalaaliDate(maxDate);

  let parsedInitial = null;
  let parsedRangeStart = null;
  let parsedRangeEnd = null;

  if (mode === 'range' && initialValue && typeof initialValue === 'object') {
    parsedRangeStart = parseJalaaliDate(initialValue.start);
    parsedRangeEnd = parseJalaaliDate(initialValue.end);
    parsedInitial = parsedRangeStart;
  } else {
    parsedInitial = parseJalaaliDate(initialValue);
  }

  const currentView = ref('days');
  const currentYear = ref(parsedInitial?.jy || today.jy);
  const currentMonth = ref(parsedInitial?.jm || today.jm);
  const selectedYear = ref(parsedInitial?.jy || null);
  const selectedMonth = ref(parsedInitial?.jm || null);
  const selectedDay = ref(parsedInitial?.jd || null);
  const confirmedDate = ref(parsedInitial ? { ...parsedInitial } : null);

  const rangeStart = ref(parsedRangeStart);
  const rangeEnd = ref(parsedRangeEnd);

  const WEEKDAYS = computed(() => getJalaaliWeekdays(locale));
  const MONTHS = computed(() => Array.from({ length: 12 }, (_, i) => i + 1));

  const selectedDate = computed(() => {
    if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) {
      return null;
    }
    return {
      jy: selectedYear.value,
      jm: selectedMonth.value,
      jd: selectedDay.value,
    };
  });

  const yearRange = computed(() => {
    const years = [];
    for (let i = currentYear.value - 5; i <= currentYear.value + 6; i++) {
      years.push(i);
    }
    return years;
  });

  function isDateDisabled(year, month, day) {
    const date = { jy: year, jm: month, jd: day };

    if (parsedMinDate && compareDates(date, parsedMinDate) < 0) {
      return true;
    }

    if (parsedMaxDate && compareDates(date, parsedMaxDate) > 0) {
      return true;
    }

    return false;
  }

  function isDateInRange(date) {
    if (!rangeStart.value || !rangeEnd.value) return false;
    return compareDates(date, rangeStart.value) > 0 && compareDates(date, rangeEnd.value) < 0;
  }

  function isRangeStartDate(date) {
    if (!rangeStart.value) return false;
    return compareDates(date, rangeStart.value) === 0;
  }

  function isRangeEndDate(date) {
    if (!rangeEnd.value) return false;
    return compareDates(date, rangeEnd.value) === 0;
  }

  const calendarDays = computed(() => {
    const year = currentYear.value;
    const month = currentMonth.value;
    const daysInMonth = jalaaliMonthLength(year, month);
    const firstDayWeekday = getJalaaliWeekday(year, month, 1);

    const days = [];

    if (firstDayWeekday > 0) {
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const prevMonthDays = jalaaliMonthLength(prevYear, prevMonth);

      for (let i = firstDayWeekday - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const dateObj = { jy: prevYear, jm: prevMonth, jd: day };
        days.push({
          id: `prev-${day}`,
          day,
          year: prevYear,
          month: prevMonth,
          label: toPersianNumbers(day),
          isDisabled: isDateDisabled(prevYear, prevMonth, day),
          isPrevMonth: true,
          isInRange: isDateInRange(dateObj),
          isRangeStart: isRangeStartDate(dateObj),
          isRangeEnd: isRangeEndDate(dateObj),
        });
      }
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === today.jy && month === today.jm && day === today.jd;
      const isSelected =
        year === selectedYear.value && month === selectedMonth.value && day === selectedDay.value;
      const dateObj = { jy: year, jm: month, jd: day };

      days.push({
        id: day,
        day,
        year,
        month,
        label: toPersianNumbers(day),
        isSelected,
        isToday,
        isDisabled: isDateDisabled(year, month, day),
        isInRange: isDateInRange(dateObj),
        isRangeStart: isRangeStartDate(dateObj),
        isRangeEnd: isRangeEndDate(dateObj),
      });
    }
    const totalCells = 35;
    const remainingCells = totalCells - days.length;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    for (let day = 1; day <= remainingCells; day++) {
      const dateObj = { jy: nextYear, jm: nextMonth, jd: day };
      days.push({
        id: `next-${day}`,
        day,
        year: nextYear,
        month: nextMonth,
        label: toPersianNumbers(day),
        isDisabled: isDateDisabled(nextYear, nextMonth, day),
        isNextMonth: true,
        isInRange: isDateInRange(dateObj),
        isRangeStart: isRangeStartDate(dateObj),
        isRangeEnd: isRangeEndDate(dateObj),
      });
    }

    return days;
  });

  function toggleView(view) {
    currentView.value = currentView.value === view ? 'days' : view;
  }

  function selectMonth(month) {
    currentMonth.value = month;
    currentView.value = 'days';
  }

  function selectYear(year) {
    currentYear.value = year;
    currentView.value = 'days';
  }

  function selectDay(dayObj) {
    if (dayObj.isDisabled) return;

    if (dayObj.isPrevMonth || dayObj.isNextMonth) {
      currentYear.value = dayObj.year;
      currentMonth.value = dayObj.month;
    }

    const clickedDate = { jy: dayObj.year, jm: dayObj.month, jd: dayObj.day };

    if (mode === 'range') {
      if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
        rangeStart.value = clickedDate;
        rangeEnd.value = null;
      } else {
        if (compareDates(clickedDate, rangeStart.value) < 0) {
          rangeEnd.value = rangeStart.value;
          rangeStart.value = clickedDate;
        } else {
          rangeEnd.value = clickedDate;
        }
      }
    } else {
      selectedYear.value = dayObj.year;
      selectedMonth.value = dayObj.month;
      selectedDay.value = dayObj.day;
    }
  }

  function confirmSelection() {
    if (selectedDate.value) {
      confirmedDate.value = { ...selectedDate.value };
      return confirmedDate.value;
    }
    return null;
  }

  function getMonthName(month) {
    return getJalaaliMonthName(month, locale);
  }

  function nextYearRange() {
    currentYear.value += 1;
  }

  function prevYearRange() {
    currentYear.value -= 1;
  }

  return {
    currentView,
    currentYear,
    currentMonth,
    selectedYear,
    selectedMonth,
    selectedDay,
    confirmedDate,
    rangeStart,
    rangeEnd,
    WEEKDAYS,
    MONTHS,
    yearRange,
    calendarDays,
    selectedDate,
    toggleView,
    selectMonth,
    selectYear,
    selectDay,
    confirmSelection,
    getMonthName,
    nextYearRange,
    prevYearRange,
    toPersianNumbers,
  };
}
