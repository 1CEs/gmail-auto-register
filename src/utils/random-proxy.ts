import { proxyCountry } from "../data/country";

export const randomProxy = async () => {
    while (true) {
        const randomCountry = proxyCountry[Math.floor(Math.random() * proxyCountry.length)];
        const proxyEndpoint = process.env.PROXY_API_ENDPOINT;
        if (!proxyEndpoint) {
            throw new Error("PROXY_API_ENDPOINT is not set");
        }

        const detailURL = `${proxyEndpoint}/proxies?country=${randomCountry}&ui=true&lang=en`
        const detailResponse = await fetch(detailURL);
        const data = await detailResponse.json() as CountryDetail;
        const proxyList: ProxyOfCountry[] = data.proxies;
        const isProxyCanPing = proxyList.filter((proxy) => proxy.ping != null);

        if(isProxyCanPing.length == 0) {
            continue;
        }

        const randomProxy = isProxyCanPing[Math.floor(Math.random() * isProxyCanPing.length)];

        if (!randomProxy) {
            continue;
        }
        const proxyURL = `${proxyEndpoint}/proxy?country=${randomCountry}&ui=true&lang=en&hostname=${randomProxy?.hostname}&port=${randomProxy.port}`
        const credential = await fetch(proxyURL);
        const credentialData = await credential.json() as any;
        return {
            proxy: `${credentialData.proxy.hostname}:${credentialData.proxy.port}`,
            username: credentialData.proxy.login,
            password: credentialData.proxy.password,
            code: credentialData.content.country.toLowerCase()
        }
    }
}