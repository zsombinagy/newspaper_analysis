<script lang="ts">
  import { onMount } from "svelte";
  import {fly } from "svelte/transition"
  import {flip} from "svelte/animate"

  let links: string[] = [];
  let text = ""

  onMount(() => {
    const storedLinks = localStorage.getItem("links");

    if (storedLinks) {
      links = JSON.parse(storedLinks);
    }
  });

  const handleEnter = () => {
    links = [...links, text];
    localStorage.setItem("links", JSON.stringify(links));
    text = "";
  };

  const handleCopy = (link: string) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        console.log("Link copied to clipboard:", link);
      })
      .catch((err) => {
        console.error("Failed to copy the link:", err);
      });
  };

  const handleRemove = (linkToDelete: string) => {
    links = links.filter(link => link !== linkToDelete)
    localStorage.setItem("links", JSON.stringify(links))

  }
</script>

<div class="w-full flex items-center flex-col">
  <form
    class="bg-white border-main_blue w-11/12 border-2 mt-10
     rounded flex px-1 py-2 justify-between focus:border-purple-color
      form-focus md:py-[0.125rem] md:px-5 shadow-main_shadow_blue shadow
      md:w-3/6 md:mt-20"
  >
    <input
      class="text-xl focus:outline-none lg:text-base ml-2"
      type="text"
      placeholder="cikk linkek"
      bind:value={text}
    />
    <button
      class="text-4xl align-middle pb-1 button-focus lg:text-2xl text-main_yellow"
      type="button"
      on:click={handleEnter}>&#8594;</button
    >
  </form>
  {#if links.length !== 0}
    <div transition:fly={{ x: 0, y: 0,duration: 1000}}  class="font-playfair mt-5 flex items-center flex-col w-full">
      <h1 class="text-main_blue mb-2">Eddigi linkek:</h1>
      <div class="w-full flex items-center flex-col">
        {#each links as link}
          <div 
            class="flex shadow-md shadow-main_shadow_gray m-2 justify-between w-9/12 rounded-sm p-2"
          >
            <h1>{link.length > 20 ? `${link.slice(0, 20)}...` : link}</h1>
            <div>
              <button on:click={() => handleCopy(link)}
                ><img src="/copy.png" alt="" class="size-4" /></button
              >
              <button on:click={() => handleRemove(link)}
                ><img src="/remove.png" alt="" class="size-4" /></button
              >
            </div>
        </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
