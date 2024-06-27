<script lang="ts">
  import type { AdminInfoType } from "../../stores/stores";
  import { adminInfo } from "../../stores/stores";
  import { fade } from 'svelte/transition'
  let admin: AdminInfoType = null

  adminInfo.subscribe(value => {
    admin = value
  }
    
  )
  const changeAdmin = () => {
    adminInfo.set(null);
    ;
  };
</script>

<div 
  class="absolute top-0 left-0 flex justify-center items-center h-full w-full"
>
  {#if admin !== null}
  <div class="bg-main_error h-30 w-30 font-playfair py-10 px-5 shadow-lg shadow-black flex flex-col justify-center">
    <h1 class="text-base md:text-2xl mb-5 text-white text-center ">
      Sajnos valami hiba történt, <br> vagy nincsen hozzáférésed az admin
      oldalhoz!
    </h1>
    <button class="py-2 bg-main_blue rounded text-white" on:click={changeAdmin}>Újrapróbálkozás</button>
  </div>
  {:else}
    <div class="bg-main_blue h-30 w-30 font-playfair py-10 px-5 shadow-lg shadow-black " transition:fade={{ delay: 250, duration: 300 }} >
      <h1 class="text-base md:text-2xl mb-5 text-white">Üdvözlünk a Köz admin oldalán</h1>
      <div class="flex justify-center">
        <form class="auth-from flex items-center" method="post" action="?/OAuth2">
          <img src="google.png" class="size-8" alt="" />
          <button class="align-center text-white">Bejelentkezés</button>
        </form>
      </div>
    </div>
  {/if}
</div>
