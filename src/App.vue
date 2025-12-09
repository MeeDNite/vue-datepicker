<script setup>
  import { ref } from 'vue';
  import DatepickerInput from './components/datepicker/DatepickerInput.vue';
  import DatepickerHeadless from './components/datepicker/DatepickerHeadless.vue';

  const defaultDate = ref(null);
  const iconOnlyDate = ref(null);
  const inputOnlyDate = ref(null);
  const customTriggerDate = ref(null);
  const customInputDate = ref(null);
  const customIconDate = ref(null);
  const headlessDate = ref(null);

  const handleConfirm = (type, value) => {
    console.log(`${type}:`, value);
  };
</script>

<template>
  <div class="container">
    <h1 style="text-align: center; margin-bottom: 40px">Datepicker Customization Examples</h1>

    <div class="demo-section">
      <h3>1. Default Behavior (Both Input & Icon)</h3>
      <p>Click either the input field or the calendar icon to open the datepicker</p>
      <DatepickerInput
        v-model="defaultDate"
        placeholder="Click input or icon"
        @confirm="handleConfirm('Default', $event)"
      />
      <pre>{{ defaultDate }}</pre>
    </div>

    <div class="demo-section">
      <h3>2. Icon Only Trigger</h3>
      <p>Only clicking the icon opens the datepicker</p>
      <DatepickerInput
        v-model="iconOnlyDate"
        trigger-on="icon"
        placeholder="Click icon only"
        @confirm="handleConfirm('Icon Only', $event)"
      />
      <pre>{{ iconOnlyDate }}</pre>
    </div>

    <div class="demo-section">
      <h3>3. Input Only Trigger</h3>
      <p>Only clicking the input field opens the datepicker</p>
      <DatepickerInput
        v-model="inputOnlyDate"
        trigger-on="input"
        placeholder="Click input only"
        @confirm="handleConfirm('Input Only', $event)"
      />
      <pre>{{ inputOnlyDate }}</pre>
    </div>

    <div class="demo-section">
      <h3>4. Custom Trigger (Button)</h3>
      <p>Completely custom trigger element</p>
      <DatepickerInput v-model="customTriggerDate" trigger-on="trigger">
        <template #trigger="{ open, formattedDate }">
          <button class="custom-trigger-btn" @click="open">
            📅 {{ formattedDate || 'Select Date' }}
          </button>
        </template>
      </DatepickerInput>
      <pre>{{ customTriggerDate }}</pre>
    </div>

    <div class="demo-section">
      <h3>5. Custom Input Slot</h3>
      <p>Custom styled input field</p>
      <DatepickerInput v-model="customInputDate">
        <template #input="{ open, formattedDate, placeholder }">
          <input
            type="text"
            class="custom-input"
            :value="formattedDate"
            :placeholder="placeholder"
            readonly
            @click="open"
          />
        </template>
      </DatepickerInput>
      <pre>{{ customInputDate }}</pre>
    </div>

    <div class="demo-section">
      <h3>6. Custom Icon Slot</h3>
      <p>Custom icon instead of default calendar icon</p>
      <DatepickerInput v-model="customIconDate">
        <template #icon="{ open }">
          <button class="custom-icon-btn" @click="open">🗓️</button>
        </template>
      </DatepickerInput>
      <pre>{{ customIconDate }}</pre>
    </div>

    <div class="demo-section">
      <h3>7. Headless Mode (Full Custom UI)</h3>
      <p>Build your own UI completely from scratch</p>
      <DatepickerHeadless v-model="headlessDate" mode="single">
        <template #default="{ open, toggle, isOpen, selectedValue }">
          <div class="headless-wrapper">
            <div class="headless-info">
              <span>Selected: {{ selectedValue?.jy }}/{{ selectedValue?.jm }}/{{ selectedValue?.jd || 'None' }}</span>
              <span>Status: {{ isOpen ? '🟢 Open' : '🔴 Closed' }}</span>
            </div>
            <div class="headless-controls">
              <button class="headless-btn primary" @click="open">Open Picker</button>
              <button class="headless-btn secondary" @click="toggle">Toggle Picker</button>
            </div>
          </div>
        </template>
      </DatepickerHeadless>
      <pre>{{ headlessDate }}</pre>
    </div>
  </div>
</template>

<style lang="scss">
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .demo-section {
    margin-bottom: 30px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;

    h3 {
      margin-top: 0;
      margin-bottom: 8px;
      color: #333;
    }

    p {
      margin-top: 0;
      margin-bottom: 15px;
      color: #666;
      font-size: 14px;
    }

    pre {
      margin-top: 15px;
      padding: 10px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow-x: auto;
      min-height: 40px;
      font-size: 12px;
    }
  }

  .custom-trigger-btn {
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .custom-input {
    width: 100%;
    max-width: 300px;
    padding: 14px 18px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;

    &:hover {
      border-color: #667eea;
    }

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  .custom-icon-btn {
    padding: 8px 12px;
    background: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 10px;

    &:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }
  }

  .headless-wrapper {
    padding: 20px;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
  }

  .headless-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 12px;
    background: #f8f9ff;
    border-radius: 8px;

    span {
      font-size: 14px;
      color: #333;

      &:last-child {
        font-weight: 600;
      }
    }
  }

  .headless-controls {
    display: flex;
    gap: 10px;
  }

  .headless-btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &.primary {
      background: #667eea;
      color: white;

      &:hover {
        background: #5568d3;
      }
    }

    &.secondary {
      background: #e0e0e0;
      color: #333;

      &:hover {
        background: #d0d0d0;
      }
    }
  }
</style>
