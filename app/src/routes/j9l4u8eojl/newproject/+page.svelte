<script lang="ts">
  import AdminNav from "../../../components/AdminNav.svelte";
  import { onMount } from "svelte"; 
  
  let links: string[] = [];
  let text = "";
  const handleEnter = () => {
    links.push(text);
    text = "";
  };
  let animate = false

  onMount(() => {
    animate = true;
  });


  function typewriter(node: Node, { speed = 1 }: { speed?: number } = {}): { duration: number; tick: (t: number) => void } {
    const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

    if (!valid) {
      throw new Error(`This transition only works on elements with a single text node child`);
    }

    const text = node.textContent;
    if (text === null) {
      return { duration: 0, tick: () => {} };
    }

    const duration = text.length / (speed * 0.01);

    return {
      duration,
      tick: (t: number) => {
        const i = Math.trunc(text.length * t);
        node.textContent = text.slice(0, i);
      }
    };
  }
</script>

<main class="h-full">
  <AdminNav></AdminNav>
  <div class="flex justify-center items-center w-full mt-10 flex-col font-playfair">
    {#if animate}
    <h1 transition:typewriter={{ speed: 1 }} class="text-center text-2xl text-main_blue">
        Kérlek írj be cikk linkeket, amelyeket szeretnéd, hogy kielemezzen a Chat GPT
      </h1>
    {/if}
    <form class="bg-white border-main_blue w-11/12 border-2 mt-10 rounded flex px-1 py-2 justify-between focus:border-purple-color form-focus md:py-[0.125rem] md:px-5 shadow-main_shadow_blue shadow">
      <input
        class="text-xl focus:outline-none lg:text-base ml-2"
        type="text"
        placeholder="cikk linkek"
        bind:value={text}
      />
      <button class="text-4xl align-middle pb-1 button-focus lg:text-2xl text-main_yellow mr-4" type="button" on:click={handleEnter}>&#8594;</button>
    </form>
  </div>
</main>