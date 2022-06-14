import{_ as p,k as o,o as c,c as l,a,b as t,d as n,e}from"./app.cbb72d4a.js";const i={},r=a("h1",{id:"installation",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#installation","aria-hidden":"true"},"#"),n(" Installation")],-1),u=a("h2",{id:"using-package-manager",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#using-package-manager","aria-hidden":"true"},"#"),n(" Using Package Manager")],-1),d=n("We recommend using the package manager (NPM, "),k={href:"https://yarnpkg.com/",target:"_blank",rel:"noopener noreferrer"},m=n("Yarn"),g=n(", "),h={href:"https://pnpm.io/",target:"_blank",rel:"noopener noreferrer"},v=n("PNPM"),b=n(") to install Vue 3D Model."),_=e(`<p>With NPM:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> vue-3d-model --save
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>With Yarn:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">yarn</span> <span class="token function">add</span> vue-3d-model
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>With PNPM:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">pnpm</span> <span class="token function">install</span> vue-3d-model
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,6),f=n("If you are in a bad network environment, you can try other registries and tools like "),x={href:"https://github.com/cnpm/cnpm",target:"_blank",rel:"noopener noreferrer"},q=n("CNPM"),I=n("."),N=e(`<h2 id="import-in-browser" tabindex="-1"><a class="header-anchor" href="#import-in-browser" aria-hidden="true">#</a> Import in Browser</h2><p>Add <code>script</code> tag in your browser and use the global variable <code>Vue3DModel</code>.</p><h3 id="unpkg" tabindex="-1"><a class="header-anchor" href="#unpkg" aria-hidden="true">#</a> unpkg</h3><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
  <span class="token comment">&lt;!-- Import Vue 3 --&gt;</span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>//unpkg.com/vue@next<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
  <span class="token comment">&lt;!-- Import component library --&gt;</span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>//unpkg.com/vue-3d-model<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="jsdelivr" tabindex="-1"><a class="header-anchor" href="#jsdelivr" aria-hidden="true">#</a> jsDelivr</h3><div class="language-html ext-html line-numbers-mode"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
  <span class="token comment">&lt;!-- Import Vue 3 --&gt;</span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>//cdn.jsdelivr.net/npm/vue@next<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
  <span class="token comment">&lt;!-- Import component library --&gt;</span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>//cdn.jsdelivr.net/npm/vue-3d-model<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,6);function y(M,P){const s=o("ExternalLinkIcon");return c(),l("div",null,[r,u,a("p",null,[d,a("a",k,[m,t(s)]),g,a("a",h,[v,t(s)]),b]),_,a("p",null,[f,a("a",x,[q,t(s)]),I]),N])}var j=p(i,[["render",y],["__file","index.html.vue"]]);export{j as default};