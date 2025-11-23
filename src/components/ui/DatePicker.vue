<template>
  <section class="datepicker">
    <DatepickerHeader @close="handleClose" />
    <DatepickerContent
      :locale="props.locale"
      :mode="props.mode"
      :initial-value="props.modelValue"
      :min-date="props.minDate"
      :max-date="props.maxDate"
      @update:selected-date="onDateSelect"
      @update:range-selection="onRangeSelect"
      ref="contentRef"
    />
    <BaseButton variant="primary" type="submit" size="medium" block @click="handleConfirm">
      تایید
    </BaseButton>
  </section>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import DatepickerContent from './DatepickerContent.vue';
  import DatepickerHeader from './DatepickerHeader.vue';
  import BaseButton from '../common/BaseButton.vue';

  const props = defineProps({
    modelValue: {
      type: [Object, String],
      default: null,
    },
    locale: {
      type: String,
      default: 'fa',
    },
    mode: {
      type: String,
      default: 'single', // 'single' | 'range'
    },
    minDate: {
      type: [Object, String],
      default: null,
    },
    maxDate: {
      type: [Object, String],
      default: null,
    },
  });

  const emit = defineEmits(['update:modelValue', 'confirm', 'open', 'close', 'change']);

  const contentRef = ref(null);

  function onDateSelect(date) {
    emit('change', date);
  }

  function onRangeSelect(range) {
    emit('change', range);
  }

  function handleConfirm() {
    if (contentRef.value) {
      const confirmedDate = contentRef.value.confirmSelection();
      if (confirmedDate) {
        emit('update:modelValue', confirmedDate);
        emit('confirm', confirmedDate);
      }
    }
  }

  function handleClose() {
    emit('close');
  }

  onMounted(() => {
    emit('open');
  });

  onUnmounted(() => {
    emit('close');
  });
</script>

<style scoped lang="scss">
  .datepicker {
    background-color: $gray-100;
    width: 360px;
    padding: 24px 16px 16px 16px;
    border-radius: $radius-8;
    @include customFlex(column, space-between, 12px);
  }
</style>
