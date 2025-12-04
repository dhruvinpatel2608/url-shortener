const fetchshortURL=async()=>{
   const res=await fetch("/link");
   const links = await res.json();
   console.log("links",links)

   const list = document.getElementById("shortened-urls");
   list.innerHTML=" ";

   for(const[shortCode,url] of Object.entries(links)){
        const li = document.createElement('li');
        li.innerHTML = `<a href="/${shortCode}" target="_blank"> ${window.location.origin}/${shortCode}</a>-${url}`
        list.appendChild(li)
   }
}

document.getElementById("shortener-form").addEventListener('submit', async (env) => {
  env.preventDefault();
  const formdata = new FormData(env.target)
  const url = formdata.get("url");
  const shortCode = formdata.get("shortCode")

  try {
    const response = await fetch("/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, shortCode })
    });

    if (response.ok) {
      fetchshortURL();
      alert("sucessfully URL Submitted")
      env.target.reset();
    } else {
      const errorMeassge = await response.text();
      alert(errorMeassge);
    }
  } catch (error) {

  }
  document.getElementById("url").value = "";
  document.getElementById("shortCode").value = "";
})
fetchshortURL();