<script lang="ts">
  import { Facebook, Twitter } from "svelte-share-buttons-component"

  export let url: string
  export let title: string
</script>

{#if url}
  <div class="flex gap-2 justify-center w-full fixed bottom-4 center">
    <Facebook class="h-10 w-10 rounded" url="https://xn--l3cap7c4a4br8ewf.fun/" />
    <Twitter class="h-10 w-10 rounded" text={title} url="https://xn--l3cap7c4a4br8ewf.fun/" />
  </div>
{/if}
