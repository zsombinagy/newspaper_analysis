<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const adminName = params.get("name");
    const adminEmail = params.get("email")

    if (adminName && adminEmail) {
      localStorage.setItem("adminName", adminName);
      localStorage.setItem("adminEmail", adminEmail)
      goto("/j9l4u8eojl");
    }
  });
</script>
