<template>
  <slot
    :open="open"
    :close="close"
    :toggle="toggle"
    :is-open="isOpen"
    :selected-value="internalValue"
  >
  </slot>

  <Transition name="datepicker-fade">
    <div v-if="isOpen" class="datepicker__overlay" @click="close">
      <div class="datepicker__overlay-content" @click.stop>
        <DatePicker
          v-model="internalValue"
          :mode="mode"
          :min-date="minDate"
          :max-date="maxDate"
          :years-before="yearsBefore"
          :years-after="yearsAfter"
          :locale="currentLocale"
          :enable-time="enableTime"
          :time-format="timeFormat"
          :enable-locale-selector="enableLocaleSelector"
          @confirm="handleConfirm"
          @close="close"
          @change="handleChange"
          @update:locale="handleLocaleChange"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import DatePicker from './DatePicker.vue';
  import { useI18nStore } from '@/store/i18n';
  import { transformOutput } from '@/utils/datepicker/outputFormatter';

  const props = defineProps({
    modelValue: {
      type: Object,
      default: null,
    },
    mode: {
      type: String,
      default: 'single',
      validator: (value) => ['single', 'range', 'multiple'].includes(value),
    },
    locale: {
      type: String,
      default: null,
    },
    minDate: {
      type: [Date, String],
      default: null,
    },
    maxDate: {
      type: [Date, String],
      default: null,
    },
    yearsBefore: {
      type: Number,
      default: 50,
    },
    yearsAfter: {
      type: Number,
      default: 50,
    },
    enableTime: {
      type: Boolean,
      default: false,
    },
    timeFormat: {
      type: [String, Number],
      default: 24,
    },
    enableLocaleSelector: {
      type: Boolean,
      default: true,
    },
    outputFormat: {
      type: [String, Function],
      default: 'object',
    },
    outputStringFormat: {
      type: String,
      default: 'YYYY/MM/DD',
    },
  });

  const emit = defineEmits([
    'update:modelValue',
    'change',
    'confirm',
    'open',
    'close',
    'update:locale',
  ]);

  const i18nStore = useI18nStore();
  const isOpen = ref(false);
  const internalState = ref(props.modelValue);

  const currentLocale = computed(() => props.locale || i18nStore.currentLocale);

  const open = () => {
    isOpen.value = true;
    emit('open');
  };

  const close = () => {
    isOpen.value = false;
    emit('close');
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
    emit(isOpen.value ? 'open' : 'close');
  };

  function handleConfirm(date) {
    internalState.value = date;
    const transformedDate = transformOutput(date, props.outputFormat, props.outputStringFormat);
    emit('update:modelValue', transformedDate);
    emit('confirm', transformedDate);
    close();
  }

  const handleChange = (date) => {
    const transformedDate = transformOutput(date, props.outputFormat, props.outputStringFormat);
    emit('change', transformedDate);
  };

  const handleLocaleChange = (newLocale) => emit('update:locale', newLocale);

  const internalValue = computed({
    get: () => props.modelValue ?? internalState.value,
    set: (val) => {
      internalState.value = val;
      const transformedVal = transformOutput(val, props.outputFormat, props.outputStringFormat);
      emit('update:modelValue', transformedVal);
    },
  });

  defineExpose({
    open,
    close,
    toggle,
    isOpen,
  });
</script>

<style scoped lang="scss">
  .datepicker {
    &__overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;

      &-content {
        position: relative;
        z-index: 1001;
        animation: slideUp 0.3s ease;
      }
    }

    &-fade-enter-active,
    &-fade-leave-active {
      transition: opacity 0.2s ease;
    }

    &-fade-enter-from,
    &-fade-leave-to {
      opacity: 0;
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
  }
</style>
