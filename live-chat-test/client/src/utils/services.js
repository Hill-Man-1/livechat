/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
export const baseUrl = 'http://localhost:5000';

export const postRequest = async (url, body) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
    },
    body: body,
    });

    const data = await res.json();

    if (!res.ok) {
        let message;
        if (data?.message) {
            message = data.message;
        } else {
            message = data;
        }
    return { error: true, message };
    }
    return data;
};


export const getRequest = async (url) => {
    
    const response = await fetch(url)

    const data = await response.json();

    if (!response.ok) {
        let message = "An error occurred"

        if(data?.message){
            message = data.message
        }

        return { error: true, message };
    }

    return data;
}