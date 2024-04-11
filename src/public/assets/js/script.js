const socket = io();

socket.on("greeting", text=>{
   alert(text)
})

socket.on ("newproduct", title=>{
    alert (`The product ${title} was added.`)
});

socket.on("deletedproduct", (productName) => {
    alert(`The product ${productName} was deleted.`);
});


