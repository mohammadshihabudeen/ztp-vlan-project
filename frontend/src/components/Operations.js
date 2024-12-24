import React, { useState } from 'react';
import VlanForm from './VlanForm';
import { createVlans } from '../services/api';
import SwitchList from './SwitchList';
const Operations = () => {
    const [selectedSwitch, setSelectedSwitch] = useState(null);
    const [message, setMessage] = useState('');

    const handleSwitchSelect = (sw) => {
        setSelectedSwitch(sw);
        setMessage('');
    };

    const handleVlanSubmit = async (vlans) => {
        try {
            const response = await createVlans(selectedSwitch.id, vlans);
            setMessage(response.message);
        } catch (error) {
            setMessage('Error creating VLANs.');
        }
    };

    return (
        <div>
            <h2>Switch Operations</h2>
            {!selectedSwitch ? (
                <SwitchList onSelect={handleSwitchSelect} />
            ) : (
                <>
                    <h3>Selected Switch: {selectedSwitch.ip}</h3>
                    <VlanForm onSubmit={handleVlanSubmit} />
                </>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default Operations;
