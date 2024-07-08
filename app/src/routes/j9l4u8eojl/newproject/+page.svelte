<script lang="ts">
  import AdminNav from "../../../components/AdminNav.svelte";
  import { onMount } from "svelte"; 
  import ListingLinks from "../../../components/ListingLinks.svelte";
  import ArticleAnalysis from "../../../components/ArticleAnalysis.svelte";
  import { linksArray } from "../../../stores/data";

  let animate = false
  let links: string[]
  let analysis = false

  onMount(() => {
    animate = true;
    
    linksArray.subscribe((value) => {
      links = value
    })
    
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
  <div class="flex justify-center items-center w-full mt-10 md:mt-20 flex-col font-playfair">
    {#if analysis === false}
      
    
    {#if animate}
    <h1 transition:typewriter={{ speed: 1 }} class="text-center text-2xl text-main_yellow w-11/12">
        Kérlek másolj be cikk linkeket, amelyeket szeretnéd, hogy kielemezzen a Chat GPT
      </h1>
    {/if}

    <ListingLinks></ListingLinks>
    <form method="post" action="?/chatGPT">
      
      <button>Értékelés kezdése</button>
    </form>
    {:else}
    <ArticleAnalysis></ArticleAnalysis>
    {/if}
  </div>
  
  
</main>