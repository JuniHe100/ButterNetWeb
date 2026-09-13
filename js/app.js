document.addEventListener("DOMContentLoaded",async()=>{
  const text=document.getElementById("connectionText");
  const dot=document.querySelector(".statusDot");

  try{
    const result=await ButterNet.health();
    if(result){
      text.textContent="ButterNet is online";
      dot.style.background="#45b96b";
    }
  }catch(e){
    text.textContent="Backend is not connected yet";
    dot.style.background="#d89b22";
  }

  try{
    const rooms=await ButterNet.rooms();
    if(Array.isArray(rooms)) {
      document.getElementById("roomCount").textContent=rooms.length;
    }
  }catch(e){}
});
