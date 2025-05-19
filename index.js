const fileGet = document.getElementById('fileGet');
const button = document.getElementById('upload');
const notSaved = document.getElementById('container1');
const saved = document.getElementById('container2');

fileGet.addEventListener('change', () => {
    let files = fileGet.files;

    for (let file of files) {
        newImage(URL.createObjectURL(file), false)
    }
});

const supabaseURL = "https://krorlzsycjvaqlfxuaxj.supabase.co";
const supabaseKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyb3JsenN5Y2p2YXFsZnh1YXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MDU4OTAsImV4cCI6MjA2MzE4MTg5MH0.b7pPO9TLwwNtBZtgeIFMfZ1wIU_Q_trCv2UhsDaca7E";

const base = supabase.createClient(supabaseURL, supabaseKEY);

button.addEventListener('click', async () => {
    await uploadImages()
})


function createRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function blobURLtoFile(blobURL) {
    const response = await fetch(blobURL)
    const blob = await response.blob()
    return new File([blob], '', {type: blob.type})
}

async function uploadImages() {   
    for (let elem of [...notSaved.children]) {
        let blobUrl = [...elem.children][0].getAttribute('src')
        let file = await blobURLtoFile(blobUrl)

        let {data, error} = await base.storage.from('french').upload(createRandomString(10) + ".png", file)
    }
}

function error() {
    let e = document.createElement('p')
    e.innerHTML = "fine"
    saved.appendChild(e)
}

(async () => {
    const getFileRefs = await base.storage.from('french').list()

    for (let ref of getFileRefs['data']) {
        if (ref['name'] != ".emptyFolderPlaceholder") {
            const item = await base.storage.from('french').getPublicUrl(ref['name'])
                
            newImage(item['data']['publicUrl'], true)
        }
    }
})()

function newImage(url, isSaved) {
    let imgContainer = document.createElement('div')

    let img = document.createElement('img');
    img.setAttribute('src', url);

    (isSaved? saved : notSaved).appendChild(imgContainer);
    
    imgContainer.appendChild(img)
}