// plugins/bootstrap.client.ts
import { onMounted } from 'vue';

onMounted(() => {
  const scriptEl = document.createElement('script');
  scriptEl.src = '/assets/bootstrap.bundle.min.js';
  scriptEl.defer = true;
  document.body.appendChild(scriptEl);
});
