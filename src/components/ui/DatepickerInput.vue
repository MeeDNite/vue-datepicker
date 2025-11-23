<template>
  <main class="datepicker-wrapper">
    <div class="datepicker-input-container">
      <input
        ref="inputRef"
        type="text"
        class="datepicker-input"
        :value="formattedDate"
        :placeholder="placeholder"
        readonly
        @click="togglePicker"
      />
      <button type="button" class="datepicker-input__icon" @click="togglePicker">
        <CalendarIcon />
      </button>
    </div>

    <Transition name="datepicker-fade">
      <div v-if="isOpen" class="datepicker-overlay" @click="closePicker">
        <div class="datepicker-container" @click.stop>
          <DatePicker
            v-model="internalValue"
            :min-date="minDate"
            :max-date="maxDate"
            :locale="locale"
            @confirm="handleConfirm"
            @close="closePicker"
            @change="handleChange"
          />
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import DatePicker from './DatePicker.vue';
  import { toPersianNumbers } from '@/utils/toPersianNumbers';
  import CalendarIcon from '../icons/CalendarIcon.vue';

  const props = defineProps({
    modelValue: {
      type: Object,
      default: null,
    },
    placeholder: {
      type: String,
      default: 'انتخاب تاریخ',
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD',
    },
    locale: {
      type: String,
      default: 'fa',
    },
    minDate: {
      type: [Date, String],
      default: null,
    },
    maxDate: {
      type: [Date, String],
      default: null,
    },
  });

  const emit = defineEmits(['update:modelValue', 'change', 'confirm', 'open', 'close']);

  const isOpen = ref(false);
  const internalValue = ref(props.modelValue);
  const inputRef = ref(null);

  const formattedDate = computed(() => {
    if (!internalValue.value) return '';

    const { jy, jm, jd } = internalValue.value;
    let formatted = props.format;

    formatted = formatted.replace('YYYY', jy);
    formatted = formatted.replace('MM', String(jm).padStart(2, '0'));
    formatted = formatted.replace('DD', String(jd).padStart(2, '0'));

    return toPersianNumbers(formatted);
  });

  function togglePicker() {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      emit('open');
    } else {
      emit('close');
    }
  }

  function closePicker() {
    isOpen.value = false;
    emit('close');
  }

  function handleConfirm(date) {
    internalValue.value = date;
    emit('update:modelValue', date);
    emit('confirm', date);
    closePicker();
  }

  function handleChange(date) {
    emit('change', date);
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      internalValue.value = newValue;
    },
  );
</script>

<style scoped lang="scss">
  .datepicker-wrapper {
    position: relative;
    width: 200px;
  }

  .datepicker-input-container {
    position: relative;
    width: 100%;
  }

  .datepicker-input {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border: 1px solid $gray-200;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'IRANYekan';
    font-variant-numeric: normal;
    cursor: pointer;
    transition: all 0.2s;
    background-color: $white-100;

    &:focus {
      outline: none;
      border-color: $primary-500;
    }
    &::placeholder {
      color: $gray-300;
    }
  }

  .datepicker-input__icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $gray-300;
    transition: color 0.2s;
  }

  .datepicker-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .datepicker-container {
    position: relative;
    z-index: 1001;
  }

  .datepicker-fade-enter-active,
  .datepicker-fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .datepicker-fade-enter-from,
  .datepicker-fade-leave-to {
    opacity: 0;
  }

  .datepicker-fade-enter-active .datepicker-container {
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
