async function submitMessage(e) {
    e.preventDefault();
    let messages = e.target.messages.value;
    console.log(messages);
}
