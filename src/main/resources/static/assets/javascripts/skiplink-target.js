$(document).ready(function(){
    setSkipLinkTargetId()
});

function setSkipLinkTargetId() {
    document.getElementsByTagName("h1").item(0).id = "skiplinktarget";
}