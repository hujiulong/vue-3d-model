<script setup>
function redirect() {
  if (typeof navigator === 'undefined' || !navigator || !navigator.language) return;
  const [lang] = navigator.language.split('-');
  if (lang === 'zh') {
    document.location.replace('/zh/guide/installation/');
    return;
  }
  document.location.replace(`/en/guide/installation/`);
}

redirect();
</script>

Redirecting...