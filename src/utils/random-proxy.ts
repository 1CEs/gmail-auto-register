

export const randomProxy = async () => {
    while (true) {
        const response = await fetch(process.env.PROXY_API_ENDPOINT!, {
            headers: {
                'Authorization': `Token ${process.env.WEBSHARE_API_KEY}`
            }
        })
        const data = await response.json() as ProxyResponse
        const proxy = data.results[Math.floor(Math.random() * data.results.length)]
        return {
            proxy: `${proxy?.proxy_address}:${proxy?.port}`,
            username: proxy?.username,
            password: proxy?.password,
            code: proxy?.country_code.toLowerCase()
        }
    }
}