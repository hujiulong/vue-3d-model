import{E as s}from"./example-event.ba0d46dd.js";import{_ as a,o as t,c as e,b as p,a as n,d as o,e as c}from"./app.d963f1ff.js";import"./vue-3d-model.esm.ecb79028.js";const l=n("h1",{id:"event",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#event","aria-hidden":"true"},"#"),o(" Event")],-1),i=c(`<div class="language-vue ext-vue line-numbers-mode"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>model-obj</span>
    <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>/static/models/obj/tree.obj<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">@mousemove</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>onMouseMove<span class="token punctuation">&quot;</span></span>
  <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> ModelObj <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-3d-model&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> object <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">onMouseMove</span><span class="token punctuation">(</span><span class="token parameter">event<span class="token punctuation">,</span> intersected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>object<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    object<span class="token punctuation">.</span>material<span class="token punctuation">.</span>color<span class="token punctuation">.</span><span class="token function">setStyle</span><span class="token punctuation">(</span><span class="token string">&#39;#fff&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>intersected<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    object <span class="token operator">=</span> intersected<span class="token punctuation">.</span>object<span class="token punctuation">;</span>
    object<span class="token punctuation">.</span>material<span class="token punctuation">.</span>color<span class="token punctuation">.</span><span class="token function">setStyle</span><span class="token punctuation">(</span><span class="token string">&#39;#13ce66&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),u={__name:"index.html",setup(r){return(k,d)=>(t(),e("div",null,[l,p(s),i]))}};var g=a(u,[["__file","index.html.vue"]]);export{g as default};
