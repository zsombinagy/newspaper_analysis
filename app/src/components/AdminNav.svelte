<script lang="ts">
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";
  
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };

  const adminName = window.localStorage.getItem("adminName")
  const adminEmail = window.localStorage.getItem("adminEmail")

</script>

<nav
  class="w-full bg-main_blue text-white flex justify-between py-2 px-5 font-playfair"
>
  <div class="">
    <a href="/j9l4u8eojl/admin">
      <div class="">
        <p>{adminName}</p>
        <p class="hidden">{adminEmail}</p>
      </div>
    </a>
  </div>
  <button class="focus:outline-none mt-1.5 md:hidden" on:click={toggleMenu}>
    <span
      class="block bar-1 w-6 h-0.5 bg-white mb-1.5 bar"
      class:active={isMenuOpen}
    ></span>
    <span
      class="block bar-2 w-6 h-0.5 bg-white mb-1.5 bar"
      class:active={isMenuOpen}
    ></span>
    <span
      class="block bar-3 w-6 h-0.5 bg-white mb-1.5 bar"
      class:active={isMenuOpen}
    ></span>
  </button>
  {#if isMenuOpen}
    <div class="absolute top-10 left-0 bg-main_blue w-full opacity-80"  transition:fly={{ x: 0, y: 0,duration: 1000}}>
      <ul class="flex justify-center flex-col items-center pt-3">
        <li><a href="/j9l4u8eojl/ownProjects">Saját Projekteim</a></li>
        <li><a href="/j9l4u8eojl/allProjects">Összes projekt</a></li>
        <li><a href="/j9l4u8eojl/newPorject">Új cikk elemzés</a></li>
      </ul>
    </div>
  {/if}
</nav>

<style>
  .bar {
    transition: 0.4s;
  }
  .bar-1.active {
    transform: rotate(-45deg) translate(-5px, 5px);
  }
  .bar-2.active {
    opacity: 0;
  }
  .bar-3.active {
    transform: rotate(45deg) translate(-5px, -6px);
  }


</style>
