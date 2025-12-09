# Font Configuration Guide

## Overview

To keep the package size small (~24KB gzipped), fonts are **NOT** included in the bundle by default. You have several options to add fonts to your datepicker.

---

## Option 1: Custom Font via `fontConfig` Prop (Recommended)

Pass your own fonts using the `fontConfig` prop:

```vue
<template>
  <DatepickerHeadless
    v-model="date"
    :font-config="{
      jalali: 'Vazir, IRANYekan, sans-serif',
      gregorian: 'Roboto, Arial, sans-serif',
      hijri: 'Amiri, serif',
      chinese: 'Noto Sans SC, sans-serif'
    }"
  >
    <template #default="{ open, formattedDate, fontFamily }">
      <input
        :value="formattedDate"
        :style="{ fontFamily }"
        @click="open"
      />
    </template>
  </DatepickerHeadless>
</template>
```

---

## Option 2: Load Fonts via CDN

Add fonts from a CDN in your HTML:

```html
<!-- In your index.html -->
<head>
  <!-- For Persian (Jalali/Hijri) -->
  <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css" rel="stylesheet">

  <!-- Or -->
  <link href="https://cdn.jsdelivr.net/gh/rastikerdar/iran-sans@v5.0/fontiran.css" rel="stylesheet">

  <!-- For other languages -->
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
```

Then use them in your config:

```vue
<DatepickerHeadless
  :font-config="{
    jalali: 'Vazir, sans-serif',
    gregorian: 'Roboto, sans-serif'
  }"
/>
```

---

## Option 3: Import Fonts in Your App

Install and import fonts in your application:

```bash
npm install vazir-font
```

```js
// In your main.js or App.vue
import 'vazir-font/dist/font-face.css'
```

---

## Option 4: Include Fonts in Bundle (Not Recommended)

If you want to include IRANYekan fonts in the bundle:

1. Open `node_modules/@mahlaparvaz/vue-datepicker/dist/vue-datepicker.es.js`
2. Find the commented font-face rules in the CSS
3. Uncomment them

**Note:** This will increase bundle size by ~200KB.

---

## Default Fonts

If no fonts are provided, the datepicker uses these fallback fonts:

- **Jalali**: `IRANYekan, sans-serif`
- **Hijri**: `IRANYekan, sans-serif`
- **Gregorian**: `Arial, sans-serif`
- **Chinese**: `Microsoft YaHei, SimHei, sans-serif`

---

## Recommended Fonts

### For Persian (Jalali/Hijri)
- [Vazir](https://github.com/rastikerdar/vazir-font)
- [Vazirmatn](https://github.com/rastikerdar/vazirmatn)
- [IRANSans](https://github.com/rastikerdar/iran-sans)
- [Samim](https://github.com/rastikerdar/samim-font)

### For Arabic (Hijri)
- [Amiri](https://fonts.google.com/specimen/Amiri)
- [Cairo](https://fonts.google.com/specimen/Cairo)

### For Chinese
- [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC)
- Microsoft YaHei (system font)

### For Latin (Gregorian)
- Any standard web font (Roboto, Inter, Open Sans, etc.)

---

## Example: Complete Setup

```vue
<script setup>
import { ref } from 'vue'
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker'

const date = ref(null)

// Define custom fonts
const customFonts = {
  jalali: 'Vazir, Tahoma, sans-serif',
  gregorian: 'Inter, Arial, sans-serif',
  hijri: 'Amiri, serif',
  chinese: 'Noto Sans SC, sans-serif'
}
</script>

<template>
  <DatepickerHeadless
    v-model="date"
    :font-config="customFonts"
  >
    <template #default="{ open, formattedDate, fontFamily }">
      <button
        @click="open"
        :style="{ fontFamily }"
      >
        {{ formattedDate || 'Select Date' }}
      </button>
    </template>
  </DatepickerHeadless>
</template>
```

---

## Bundle Size Impact

| Approach | Bundle Size Impact |
|----------|-------------------|
| No fonts (default) | 0 KB |
| CDN fonts | 0 KB (loaded externally) |
| Custom fonts (via prop) | 0 KB (uses existing fonts) |
| Include IRANYekan in bundle | +200 KB |

---

## Best Practices

1. ✅ **Use CDN or external fonts** to keep bundle small
2. ✅ **Use `fontConfig` prop** for flexibility
3. ✅ **Provide fallback fonts** in font-family string
4. ✅ **Use WOFF2 format** for best compression
5. ✅ **Load only required font weights** (400, 500, 700)
6. ❌ **Avoid including fonts in bundle** unless absolutely necessary

---

## Troubleshooting

### Fonts not displaying correctly

1. **Check if fonts are loaded:**
   ```js
   document.fonts.ready.then(() => {
     console.log('Fonts loaded:', document.fonts.size)
   })
   ```

2. **Verify font names:**
   - Make sure font-family names match exactly
   - Check browser DevTools → Network tab for font loading

3. **Add fallback fonts:**
   ```js
   fontConfig: {
     jalali: 'MyFont, Tahoma, sans-serif' // Tahoma as fallback
   }
   ```

### Numbers not displaying in correct locale

- Make sure you're using a font that supports the number system
- Persian fonts: should support Persian/Arabic numerals
- Check the `numberSystem` prop is set correctly

---

## Need Help?

- 📖 [Main Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/mahlaparvaz/vue-datepicker/issues)
- 💬 [Discussions](https://github.com/mahlaparvaz/vue-datepicker/discussions)
