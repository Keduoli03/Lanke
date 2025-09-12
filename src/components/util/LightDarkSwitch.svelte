<script>
  import { onMount } from "svelte";

  let theme = "light";

  onMount(() => {
    theme = localStorage.getItem("theme") || "light";
  });

  function toggleTheme() {
    theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
</script>

<button on:click={toggleTheme} class="btn-plain scale-animation rounded-lg h-8 w-8 active:scale-90 text-[var(--deep-text)] hover:bg-[var(--btn-regular-bg-hover)] mx-auto block">
  {#if theme === "light"}
    <span class="icon-[material-symbols--dark-mode-outline]"></span>
  {:else}
    <span class="icon-[material-symbols--light-mode-outline]"></span>
  {/if}
</button>