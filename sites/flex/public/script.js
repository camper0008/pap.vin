const onSubmit = async (name, date, begin, end) => {
    if (name === "" || date === "" || begin === "" || end === "") {
        alert("Missing required fields");
        return;
    }
    
    const headers = new Headers({"Content-Type": "application/json"});
    const body = JSON.stringify({ name, date, begin, end });
    const res = await (await fetch("api/add", { 
        headers,
        body,
        method: "POST"
    })).json();

    alert(res.message);
}

const main = () => {
    const name   = document.getElementById("name");
    const date   = document.getElementById("date");
    const begin  = document.getElementById("begin");
    const end    = document.getElementById("end");
    const submit = document.getElementById("submit");
    
    submit.addEventListener("click", () => onSubmit(name.value, date.value, begin.value, end.value) ); 
}

main();
