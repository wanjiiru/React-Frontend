import axios from 'axios';
// import { decodeJWT } from './jwtService';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, error => {return Promise.reject(error)});

axios.interceptors.request.use(null, error => {return Promise.reject(error)});

export function setLocalStorageItem(itemName,item){
    localStorage.setItem(itemName,item);
}

export function getLocalStorageItem(itemName){
    return localStorage.getItem(itemName);
}

export function removeLocalStorageItem(itemName){
    localStorage.removeItem(itemName);
}

export async function getApiData(endPoint){
    const token = getLocalStorageItem("Token");
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    if (token){
        axios.defaults.headers = {
            "Content-Type": "application/json",
            "Authorization": token,
        }
    } else {
        axios.defaults.headers = {
            "Content-Type": "application/json",
        }
    }
    try {
        const response = await axios.get(endPoint);
        return response;
    } catch (err){
        return err.response;
    }
}

export async function postApiData(endPoint, data, contentType="application/json"){
    const token = getLocalStorageItem("Token");
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    if (token){
        axios.defaults.headers = {
            "Content-Type": contentType,
            "Authorization": token,
        }
    } else {
        axios.defaults.headers = {
            "Content-Type": contentType,
        }
    }
    try{
        const response = await axios.post(endPoint, data);
        return response;
    } catch(err){
        return err.response;
    }
}

export function getCurrentUser(){
    const token = getLocalStorageItem('Token');
    // if (token){
    //     const data = decodeJWT(token.split(" ")[1]);
    //     return data;
    // }
    if (token) return token;
    return false;
}