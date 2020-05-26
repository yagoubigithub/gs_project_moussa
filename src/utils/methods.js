export const getCurrentDateTime = (mills) =>{

    const d = new Date(mills);
    return `${d.getFullYear()}-${d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` :d.getMonth() + 1 }-${
        d.getDate() < 10 ? `0${d.getDate() }` :d.getDate() 
    }T${
        d.getHours() < 10 ? `0${d.getHours() }` :d.getHours() 
    }:${
        d.getMinutes() < 10 ? `0${d.getMinutes() }` :d.getMinutes() 
    }`
}