import React, { useState, useEffect } from 'react';
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
            <h3>Available Switches</h3>
            <ul>
                {switches.map((sw) => (
                    <li key={sw.id}>
                        <button onClick={() => onSelect(sw)}>{sw.ip}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SwitchList;
