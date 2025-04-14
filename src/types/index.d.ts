type RandomDomain = {
    domain: string;
    fullName: string;
}

type RandomUserAgent = {
    device: string[],
    useragent: string[],
}

type CountryDetail = {
    proxies: ProxyOfCountry[],
    content: {
        country: string,
        locale: string,
        h1_numbers: string,
        h1_numbers_enable: boolean,
        h1: string,
        description: string,
        keywords: string,
        hero_title: string,
        hero_numbers_content: string,
        hero_numbers_title: string,
        hero_numbers: boolean,
        hero_content: string,
        step_title: string,
        step_content: string,
        numbers_title: string,
        numbers_content: string,
        numbers_numbers_content: string,
        numbers_numbers_title: string,
        numbers_numbers_enable: boolean,
        price_title: string,
        faq_title: string,
        faq_content: string,
    },
}

type ProxyResponse = {
    count: number,
    next: null,
    previous: null,
    results: {
        id: string,
        username: string,
        password: string,
        proxy_address: string,
        port: number,
        valid: boolean,
        last_verification: string,
        country_code: string,
        city_name: string,
        created_at: string
    }[],
}

type RandomPhone = {
    country: number,
    data_humans: string,
    full_number: string,
    number: string,
    code: string,
    is_archive: boolean,
    short: string
}

type Message = {
    current_page: number,
    data: {
        id: number,
        text: string,
        in_number: string,
        my_number: number,
        created_at: string,
        data_humans: string,
        code: string,
    }[],
}