const handleShortnerClick = async () => {
    let originalUrl = document.getElementById('urlInput').value;
    let result = await getShortUrl(originalUrl);
    alert(result.newUrl);
}

const getShortUrl = async (originalUrl) => {
    let result = await axios.post('/api/shortner', {
        originalUrl
    })
    return result.data;
}