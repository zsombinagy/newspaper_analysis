<script lang="ts">
  import { goto } from "$app/navigation";
  import { fly } from "svelte/transition";
  import { onMount } from 'svelte';
  
  let isMenuOpen = false;
  let adminName = '';
  let adminEmail = '';
  let adminPicture = '';

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };

  onMount(() => {
    adminName = window.localStorage.getItem("adminName") || '';
    adminEmail = window.localStorage.getItem("adminEmail") || '';
    adminPicture = window.localStorage.getItem("adminPicture") || '';
  });
</script>

<nav
  class="w-full bg-main_blue text-white flex justify-between items-center font-playfair h-16 px-5 shadow-lg shadow-main_shadow_gray">
  <div class="">
    <a href="/j9l4u8eojl/admin">
      <div class="flex justify-between items-center">
        <img src={adminPicture} alt="" class="size-8 mr-3 rounded-lg">
        <div>
            <p class="text-base md:text-xl">{adminName}</p>
            <p class="hidden md:block text-xs">{adminEmail}</p>
        </div>

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
    <div class="absolute top-16 left-0 bg-main_blue w-full opacity-80 border-t-2 border-main_yellow md:hidden"  transition:fly={{ x: 0, y: 0,duration: 1000}}>
      <ul class="flex justify-center flex-col items-center pt-3">
        <li class="pb-3"><a href="/j9l4u8eojl/ownprojects" class="border-b-2 border-white">Saját Projekteim</a></li>
        <li class="pb-3"><a href="/j9l4u8eojl/allProjects" class="border-b-2 border-white">Összes projekt</a></li>
        <li class="pb-3"><a href="/j9l4u8eojl/newproject" class="border-b-2 border-white">Új cikk elemzés</a></li>
      </ul>
    </div>
  {/if}
  <div class="hidden md:flex items-center h-full">
    <ul class="flex items-center h-full">
      <li class="flex items-center align-middle h-full px-2 hover:bg-main_purple rounded">
        <a href="/j9l4u8eojl/ownProjects" class="">Saját Projekteim</a>
      </li>
      <li class="flex items-center h-full px-2 hover:bg-main_purple rounded">
        <a href="/j9l4u8eojl/allProjects" class="">Összes projekt</a>
      </li>
      <li class="flex items-center h-full px-2 hover:bg-main_purple rounded">
        <a href="/j9l4u8eojl/newproject" class="">Új cikk elemzés</a>
      </li>
    </ul>
  </div>
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
