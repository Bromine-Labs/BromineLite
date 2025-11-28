# to do this
go to website.nhd.org
make an account
then go to the edit page
run this bookmarklet
```
javascript:(async()=>{let e=window.editor||(window.grapesjs&&window.grapesjs.editors?window.grapesjs.editors[0]:null);if(!e){console.error("GrapesJS editor instance not found!");return}try{let t=await fetch("https://cdn.jsdelivr.net/gh/Bromine-Labs/BromineLite@main/other_versions/nhd_website/brominelite.html"),r=await t.text();e.Grape.addComponents({type:"custom-code",content:r}),e.Grape.store(),console.log("Custom code added and project saved.")}catch(o){console.error("Error executing script:",o)}})();
```

## example site:
https://site.nhd.org/11595885/home
