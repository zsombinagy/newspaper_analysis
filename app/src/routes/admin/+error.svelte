<script>
  import { page } from "$app/stores";
</script>

<div class="absolute top-0 left-0 flex justify-center items-center h-full w-full">
  <div class="font-playfair  text-center">
    <h1 class="md:text-5xl pb-2">Oops!!</h1>
    <h2 class="md:text-xl pb-2">Something went wrong!</h2>
    <p class="pb-2">{$page.status} - {$page.error?.message}</p>
    <button class="rounded bg-main_blue px-4 py-1 border border-main_blue text-white  hover:text-main_blue hover:duration-200 hover:border-main_blue hover:bg-white "><a href="/admin">Újra próbálkozás</a></button>

  </div>
</div>
