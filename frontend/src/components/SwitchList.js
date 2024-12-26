import React, { useEffect, useState } from 'react';
import { fetchSwitches } from '../services/api';

const SwitchList = ({ onSelect }) => {
    const [switches, setSwitches] = useState([]);

    useEffect(() => {
        const getSwitches = async () => {
            const data = await fetchSwitches();
            setSwitches(data);
        };
        getSwitches();
    }, []);

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Available Switches</h3>
            <ul className="space-y-3">
                {switches.map((sw) => (
                    <li key={sw.id}>
                        <button
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                            onClick={() => onSelect(sw)}
                        >
                            {sw.id} - {sw.ip}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SwitchList;
