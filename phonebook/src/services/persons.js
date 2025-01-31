import axios from "axios";

// const baseUrl = 'https://backend-young-voice-8589.fly.dev/api/persons'
// const baseUrl = 'http://localhost:3001/api/persons'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    const deleteUrl = `${baseUrl}/${id}`
    const request = axios.delete(deleteUrl)
    return request.then(response => response.data)
}

const updateNumber = (id, updatedPerson) => {
    const request = axios.put(`${baseUrl}/${id}`, updatedPerson)
    return request.then(response => response.data)
}

export default { getAll, create, deletePerson, updateNumber }