<script lang="ts">
  import type { ArticleAnalyesProp } from "../modell";

  export let data: ArticleAnalyesProp
</script>

<main class="flex flex-col items-center font-playfair pb-10 ">
  {#if !data}
    <div>Sorry something went wrong! Try again!</div>


  {:else}

  <div
    class="my-10 border border-main_blue p-2 rounded shadow-lg shadow-main_shadow_gray md:w-3/6"
  >
    <input
      type="text"
      placeholder="Téma címe"
      class="outline-none focus:outline-none"
    />
  </div>
  <div >
      {#each data as article}
        
      <div  class="shadow-lg shadow-main_shadow_blue p-2 mx-10 rounded-md bg-main_blue text-white">
        <div>
          <span class="text-xl text-main_yellow">Chat GPT válasza:</span>
          <br />cím: {article.cím} <br>
          források és nyelvezete: {article.források_nyelvezet} <br>
          objektivitás: {article.objektivitás} <br>
          író véleménye: {article.író_véleménye} <br>
          kinek szólhat: {article.kinek_szól}

          
        </div>
      </div>
      <div class="border border-main_yellow mt-10 w-10/12 p-3 rounded-lg shadow-lg shadow-main_shadow_gray">
        <div class="">
          <h2 class="mb-3">{article.link}</h2>
          <img src="/copy.png" class="size-4" alt="" />
          <div class="border-b-2 border-main_blue pt-3 pb-1"><input class="w-full focus:outline-none" type="text" placeholder="újság neve" /></div>
        </div>  
    
    
    
          <div class="border-b-2 border-main_blue pb-2 flex flex-col my-5">
            <label class="mb-2" for="">{article.eredeti_cím}</label>
            <textarea class="w-full focus:outline-none" name="" id="" rows="1" placeholder="Cikk címének tárgyalása"></textarea>
          </div>
          <div class="border-b-2 border-main_blue pb-2 flex flex-col my-5">
            <label class="mb-2" for="">Objektivitás</label>
            <textarea class="w-full focus:outline-none" name="" id="" rows="4" placeholder="Objektivitás tárgyalása"></textarea>
          </div>
          <div class="border-b-2 border-main_blue pb-2 flex flex-col my-5">
            <label class="mb-2" for="">Nyelvezet stílus</label>
            <textarea class="w-full focus:outline-none" name="" id="" rows="4" placeholder="Nyelvezet stílus tárgyalása"></textarea>
          </div>
          <div class="border-b-2 border-main_blue pb-2 flex flex-col my-5">
            <label class="mb-2" for="">Kinek szól</label>
            <textarea class="w-full focus:outline-none" name="" id="" rows="4" placeholder="Kinek szól tárgyalása"></textarea>
          </div>
          <div class="border-b-2 border-main_blue pb-2 flex flex-col my-5">
            <label class="mb-2" for="">Források</label>
            <textarea class="w-full focus:outline-none" name="" id="" rows="4" placeholder="Források tárgyalása"></textarea>
          </div>    
      
      </div>
    
      {/each}
    </div>
  {/if}
</main>
