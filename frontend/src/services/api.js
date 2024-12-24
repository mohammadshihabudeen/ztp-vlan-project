import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchSwitches = async () => {
    const response = await axios.get(`${API_URL}/switches`);
    return response.data;
};

export const createVlans = async (switchId, vlans) => {
    const response = await axios.post(`${API_URL}/create_vlans`, { switchId, vlans });
    return response.data;
};
