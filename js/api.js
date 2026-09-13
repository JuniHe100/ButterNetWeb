const ButterNet={
  apiBase:"",
  async request(path,options={}){
    const response=await fetch(this.apiBase+path,{
      ...options,
      headers:{"Content-Type":"application/json",...(options.headers||{})}
    });
    if(!response.ok) throw new Error("HTTP "+response.status);
    return response.json();
  },
  async health(){
    return this.request("/api/health");
  },
  async rooms(){
    return this.request("/api/rooms");
  }
};
