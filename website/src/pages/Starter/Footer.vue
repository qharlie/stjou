<template>
  <footer class="footer">
    <div class="container-fluid">
      <ul class="nav">
        <li class="nav-item">
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener"
            class="nav-link"
          >
            Link
          </a>
        </li>
        <li class="nav-item">
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener"
            class="nav-link"
          >
            Another Link
          </a>
        </li>
      </ul>
      <div class="copyright">
            Report issues <a href="https://github.com/charlie-sanders/stjou/issues">On Github</a>.
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>
