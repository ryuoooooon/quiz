const chat = document.getElementById("chat");

let love = 0;
let coin = 0;

function addMessage(name,text){

    chat.innerHTML += `
        <p><b>${name}</b>: ${text}</p>
    `;

    chat.scrollTop = chat.scrollHeight;
}

function sendMessage(){

    const input = document.getElementById("message");

    const msg = input.value;

    if(!msg) return;

    addMessage("あなた",msg);

    input.value = "";

    setTimeout(()=>{
        aiReply(msg);
    },500);
}

function aiReply(msg){

    let reply = "";

    if(msg.includes("こんにちは")){
        reply = "こんにちは！";
        love += 1;
    }

    else if(msg.includes("疲れ")){
        reply = "お疲れ様。ゆっくり休んでね。";
        love += 2;
    }

    else if(msg.includes("好き")){
        reply = "えっ...嬉しい。";
        love += 5;
    }

    else{
        reply = "もっとお話したいな。";
    }

    document.getElementById("love").textContent = love;

    addMessage("ミライ",reply);
}